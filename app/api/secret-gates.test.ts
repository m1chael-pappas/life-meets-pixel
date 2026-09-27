import { createHmac, randomBytes } from "node:crypto";

import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  sendMessage: vi.fn(async () => undefined),
  getRadarSources: vi.fn(async () => {
    throw new Error("radar ran");
  }),
  processSocialQueue: vi.fn(async () => 0),
  waitUntil: vi.fn(),
}));

vi.mock("@/sanity/write-client", () => ({
  writeClient: { fetch: vi.fn(), patch: vi.fn(), createIfNotExists: vi.fn() },
}));
vi.mock("@/lib/pipeline/radar", () => ({
  fetchRecentItems: vi.fn(),
  getRadarSources: mocks.getRadarSources,
  rankStories: vi.fn(),
}));
vi.mock("@/lib/pipeline/social", () => ({
  postToSocials: vi.fn(),
  processSocialQueue: mocks.processSocialQueue,
  queueForSocials: vi.fn(),
}));
vi.mock("@/lib/pipeline/drafting", () => ({ draftFromCandidate: vi.fn() }));
vi.mock("@vercel/functions", () => ({ waitUntil: mocks.waitUntil }));
vi.mock("@/lib/pipeline/telegram", () => ({
  answerCallbackQuery: vi.fn(),
  editMessageText: vi.fn(),
  escapeHtml: (s: string) => s,
  formatCandidateCard: vi.fn(),
  getFileUrl: vi.fn(),
  isAuthorizedChat: vi.fn(() => false),
  parseCallbackData: vi.fn(),
  sendCandidateCard: vi.fn(),
  sendMessage: mocks.sendMessage,
}));

const RIGHT = "right-secret";

/** Imports a route fresh so its module-level env reads see the stubbed values. */
async function loadRoute<T>(path: string): Promise<T> {
  vi.resetModules();
  return (await import(path)) as T;
}

type Handler = (req: NextRequest) => Promise<Response>;

function get(url: string, headers: Record<string, string> = {}) {
  return new NextRequest(`https://lifemeetspixel.com${url}`, { headers });
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe.each([
  { name: "/api/radar", path: "./radar/route" },
  { name: "/api/draft", path: "./draft/route" },
  { name: "/api/social", path: "./social/route" },
])("$name (CRON_SECRET)", ({ name, path }) => {
  it("rejects every request while CRON_SECRET is unset", async () => {
    vi.stubEnv("CRON_SECRET", "");
    const { GET } = await loadRoute<{ GET: Handler }>(path);
    for (const req of [get(name), get(`${name}?secret=`), get(`${name}?secret=undefined`)]) {
      expect((await GET(req)).status).toBe(401);
    }
  });

  it("rejects a wrong secret in the query and in the header", async () => {
    vi.stubEnv("CRON_SECRET", RIGHT);
    const { GET } = await loadRoute<{ GET: Handler }>(path);
    expect((await GET(get(`${name}?secret=wrong`))).status).toBe(401);
    expect((await GET(get(name, { authorization: "Bearer wrong" }))).status).toBe(401);
  });
});

describe("secret accepted", () => {
  beforeEach(() => vi.stubEnv("CRON_SECRET", RIGHT));

  it("/api/radar runs the radar for the Vercel cron header", async () => {
    const { GET } = await loadRoute<{ GET: Handler }>("./radar/route");
    const res = await GET(get("/api/radar", { authorization: `Bearer ${RIGHT}` }));
    expect(res.status).not.toBe(401);
    expect(mocks.getRadarSources).toHaveBeenCalled();
  });

  it("/api/draft reaches its own validation", async () => {
    const { GET } = await loadRoute<{ GET: Handler }>("./draft/route");
    expect((await GET(get(`/api/draft?secret=${RIGHT}`))).status).toBe(400);
  });

  it("/api/social drains the queue", async () => {
    const { GET } = await loadRoute<{ GET: Handler }>("./social/route");
    expect((await GET(get(`/api/social?secret=${RIGHT}`))).status).toBe(200);
    expect(mocks.processSocialQueue).toHaveBeenCalledOnce();
  });
});

describe("/api/telegram (TELEGRAM_WEBHOOK_SECRET)", () => {
  function post(headers: Record<string, string>, body = "{}") {
    return new NextRequest("https://lifemeetspixel.com/api/telegram", { method: "POST", headers, body });
  }

  it("rejects everything while the secret is unset", async () => {
    vi.stubEnv("TELEGRAM_WEBHOOK_SECRET", "");
    const { POST } = await loadRoute<{ POST: Handler }>("./telegram/route");
    expect((await POST(post({}))).status).toBe(401);
  });

  it("rejects a missing or wrong secret header", async () => {
    vi.stubEnv("TELEGRAM_WEBHOOK_SECRET", RIGHT);
    const { POST } = await loadRoute<{ POST: Handler }>("./telegram/route");
    expect((await POST(post({}))).status).toBe(401);
    expect((await POST(post({ "x-telegram-bot-api-secret-token": "wrong" }))).status).toBe(401);
  });

  it("passes the right secret through to payload parsing", async () => {
    vi.stubEnv("TELEGRAM_WEBHOOK_SECRET", RIGHT);
    const { POST } = await loadRoute<{ POST: Handler }>("./telegram/route");
    const res = await POST(post({ "x-telegram-bot-api-secret-token": RIGHT }, "not json"));
    expect(res.status).toBe(400);
  });
});

describe("/api/clerk (Svix signature)", () => {
  const secretBytes = randomBytes(24);
  const signingSecret = `whsec_${secretBytes.toString("base64")}`;
  const body = JSON.stringify({ type: "user.created", data: { id: "user_1", email_addresses: [] } });

  function signed(key: Buffer, payload = body) {
    const id = "msg_test";
    const timestamp = String(Math.floor(Date.now() / 1000));
    const sig = createHmac("sha256", key).update(`${id}.${timestamp}.${payload}`).digest("base64");
    return new NextRequest("https://lifemeetspixel.com/api/clerk", {
      method: "POST",
      headers: { "svix-id": id, "svix-timestamp": timestamp, "svix-signature": `v1,${sig}` },
      body: payload,
    });
  }

  it("answers 404 while the signing secret is unset", async () => {
    vi.stubEnv("CLERK_WEBHOOK_SIGNING_SECRET", "");
    const { POST } = await loadRoute<{ POST: Handler }>("./clerk/route");
    expect((await POST(signed(secretBytes))).status).toBe(404);
  });

  it("rejects an unsigned request and a request signed with another key", async () => {
    vi.stubEnv("CLERK_WEBHOOK_SIGNING_SECRET", signingSecret);
    const { POST } = await loadRoute<{ POST: Handler }>("./clerk/route");
    const unsigned = new NextRequest("https://lifemeetspixel.com/api/clerk", { method: "POST", body });
    expect((await POST(unsigned)).status).toBe(400);
    expect((await POST(signed(randomBytes(24)))).status).toBe(400);
    expect(mocks.sendMessage).not.toHaveBeenCalled();
  });

  it("accepts a correctly signed event and notifies Telegram", async () => {
    vi.stubEnv("CLERK_WEBHOOK_SIGNING_SECRET", signingSecret);
    const { POST } = await loadRoute<{ POST: Handler }>("./clerk/route");
    const res = await POST(signed(secretBytes));
    expect(res.status).toBe(200);
    expect(mocks.sendMessage).toHaveBeenCalledOnce();
  });
});
