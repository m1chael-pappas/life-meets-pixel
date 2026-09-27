import { existsSync } from "node:fs";

import { defineConfig, devices } from "@playwright/test";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

const PORT = 3300;
/** Chrome that is known to launch under WSL here; Playwright's own Chromium is used elsewhere. */
const LOCAL_CHROME = `${process.env.HOME}/.cache/puppeteer/chrome/linux-150.0.7871.24/chrome-linux64/chrome`;
const executablePath = process.env.PLAYWRIGHT_CHROME_PATH ?? (existsSync(LOCAL_CHROME) ? LOCAL_CHROME : undefined);
/** Point at an already running server (for example the dev server) to skip the production build. */
const externalBaseURL = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  expect: { timeout: 15_000 },
  workers: 2,
  reporter: [["list"]],
  use: {
    baseURL: externalBaseURL ?? `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: {
      executablePath,
      args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
    },
  },
  projects: [
    { name: "setup", testMatch: /global\.setup\.ts/ },
    { name: "e2e", dependencies: ["setup"], use: { ...devices["Desktop Chrome"], launchOptions: { executablePath, args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] } } },
  ],
  webServer: externalBaseURL
    ? undefined
    : {
        command: `./node_modules/.bin/next build && ./node_modules/.bin/next start -p ${PORT}`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: true,
        timeout: 400_000,
      },
});
