import { Facebook, Instagram } from 'lucide-react';
import { SiDiscord } from 'react-icons/si';

import { SITE_CONFIG } from '@/lib/constants';

export default function SocialSection() {
  return (
    <section className="mb-12">
      <div className="bg-muted/20 rounded-lg p-6 text-center border border-border">
        <h3 className="text-lg font-bold text-foreground mb-2 font-mono">
          FOLLOW US ON SOCIAL MEDIA
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Join our community and stay updated with the latest reviews and news
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={SITE_CONFIG.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-mono hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            <Facebook className="w-4 h-4" />
            Facebook
          </a>
          <a
            href={SITE_CONFIG.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm font-mono hover:bg-secondary/90 transition-colors inline-flex items-center gap-2"
          >
            <Instagram className="w-4 h-4" />
            Instagram
          </a>
          <a
            href={SITE_CONFIG.social.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent text-accent-foreground px-4 py-2 rounded-md text-sm font-mono hover:bg-accent/90 transition-colors inline-flex items-center gap-2"
          >
            <SiDiscord className="w-4 h-4" />
            Discord
          </a>
        </div>
      </div>
    </section>
  );
}
