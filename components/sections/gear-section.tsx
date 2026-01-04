"use client";

export default function GearSection() {
  return (
    <section className="my-12">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-xl font-bold text-foreground font-mono">
          OUR PARTNERS
        </h3>
        <div className="h-px bg-accent/30 flex-1"></div>
        <span className="text-xs text-muted-foreground font-mono">
          Affiliate Links
        </span>
      </div>

      {/* Partner Banners */}
      <div className="space-y-6">
        {/* Partner Cards - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gear Up */}
          <a
            rel="sponsored"
            href="https://gearup.sjv.io/c/6652126/3360901/40222"
            target="_blank"
            className="block bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors group h-full"
          >
            <div className="flex flex-col items-center justify-center min-h-[220px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://a.impactradius-go.com/display-ad/40222-3360901"
                alt="Gear Up"
                width={300}
                height={250}
                className="max-w-full h-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              {/* Fallback content */}
              <div className="text-center">
                <div className="text-4xl mb-3">🚀</div>
                <h4 className="text-xl font-bold text-foreground font-mono mb-2 group-hover:text-primary transition-colors">
                  GEAR UP
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Reduce Ping & Improve Connection
                </p>
                <span className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg font-mono text-sm">
                  GET STARTED →
                </span>
              </div>
            </div>
            {/* Tracking pixel */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height={0}
              width={0}
              src="https://imp.pxf.io/i/6652126/3360901/40222"
              style={{ position: 'absolute', visibility: 'hidden' }}
              alt=""
            />
          </a>

          {/* Green Man Gaming */}
          <a
            rel="sponsored"
            href="https://greenmangaming.sjv.io/c/6652126/3723045/15105"
            target="_blank"
            className="block bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors group h-full"
          >
            <div className="flex flex-col items-center justify-center min-h-[220px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://a.impactradius-go.com/display-ad/15105-3723045"
                alt="Green Man Gaming"
                width={300}
                height={250}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              {/* Fallback content */}
              <div className="text-center">
                <div className="text-4xl mb-3">🎮</div>
                <h4 className="text-xl font-bold text-foreground font-mono mb-2 group-hover:text-primary transition-colors">
                  GREEN MAN GAMING
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Buy PC Games & Game Keys
                </p>
                <span className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg font-mono text-sm">
                  SHOP GAMES →
                </span>
              </div>
            </div>
            {/* Tracking pixel */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height={0}
              width={0}
              src="https://imp.pxf.io/i/6652126/3723045/15105"
              style={{ position: 'absolute', visibility: 'hidden' }}
              alt=""
            />
          </a>
        </div>

        {/* Support Us - Full Width */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">💜</div>
              <div>
                <h4 className="text-lg font-bold text-foreground font-mono mb-1">
                  SUPPORT US
                </h4>
                <p className="text-sm text-muted-foreground">
                  When you shop through our affiliate links, we earn a small commission at no extra cost to you.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-primary/20 text-primary px-3 py-1.5 rounded font-mono">
                Games
              </span>
              <span className="text-xs bg-primary/20 text-primary px-3 py-1.5 rounded font-mono">
                Ping Optimization
              </span>
              <span className="text-xs bg-primary/20 text-primary px-3 py-1.5 rounded font-mono">
                Game Keys
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Affiliate Disclosure */}
      <p className="text-xs text-muted-foreground text-center mt-6">
        These are affiliate links. We may earn a commission on purchases.
      </p>
    </section>
  );
}
