import {
  Facebook,
  Instagram,
} from 'lucide-react';
import { SiDiscord } from 'react-icons/si';

import { SITE_CONFIG } from '@/lib/constants';

export default function SocialSection() {
  return (
    <section className="mb-12">
      <div className="bg-card rounded-lg p-6 text-center border border-border card-shadow">
        <h3 className="text-2xl font-bold text-foreground mb-2 font-mono">
          FOLLOW US ON SOCIAL MEDIA
        </h3>
        <p className="text-sm text-foreground font-medium mb-4">
          Join our community and stay updated with the latest reviews and news
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={SITE_CONFIG.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-white px-4 py-2 rounded-md text-sm font-bold font-mono hover:bg-primary/90 transition-all inline-flex items-center gap-2 card-shadow"
          >
            <Facebook className="w-4 h-4 stroke-[2.5]" />
            Facebook
          </a>
          <a
            href={SITE_CONFIG.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm font-bold font-mono hover:bg-secondary/90 transition-all inline-flex items-center gap-2 card-shadow"
          >
            <Instagram className="w-4 h-4 stroke-[2.5]" />
            Instagram
          </a>
          <a
            href={SITE_CONFIG.social.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent text-accent-foreground px-4 py-2 rounded-md text-sm font-bold font-mono hover:bg-accent/90 transition-all inline-flex items-center gap-2 card-shadow"
          >
            <SiDiscord className="w-4 h-4" />
            Discord
          </a>
        </div>
      </div>
    </section>
  );
}
