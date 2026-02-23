"use client";

import { Instagram, Linkedin, Globe, MapPin, Phone } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/goocampusworld/",
    icon: Instagram,
  },
  {
    name: "Website",
    href: "https://www.goocampusworld.com/",
    icon: Globe,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/goocampusworld-global-career-advancement-platform-b77587271/",
    icon: Linkedin,
  },
];

export function FooterSection() {
  return (
    <footer className="snap-start px-6 py-12" style={{ background: "var(--primary-900)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Main 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-10">
          {/* Column 1: Branding */}
          <div className="space-y-4">
            <span className="text-white font-semibold text-base tracking-tight">
              Salary Comparison Tool
            </span>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--neutral-400)" }}
            >
              Free forever. Helping you make informed career decisions with
              accurate salary and tax comparisons across countries.
            </p>
          </div>

          {/* Column 2: Contact Us */}
          <div className="space-y-4">
            <h3
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "var(--neutral-300)" }}
            >
              Contact Us
            </h3>
            <address className="not-italic space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0"
                  style={{ color: "var(--neutral-400)" }}
                />
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--neutral-400)" }}
                >
                  #138/6, Ground Floor, 10th Main Road, 6th-A Cross,
                  Sadashivanagar, RMV Extension, Near SBI Bank, Bangalore -
                  560080, Karnataka, India
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone
                  size={16}
                  className="shrink-0"
                  style={{ color: "var(--neutral-400)" }}
                />
                <a
                  href="tel:08041743956"
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: "var(--neutral-400)" }}
                >
                  080-41743956
                </a>
              </div>
            </address>
          </div>

          {/* Column 3: Follow Us */}
          <div className="space-y-4">
            <h3
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "var(--neutral-300)" }}
            >
              Follow Us
            </h3>
            <TooltipProvider delayDuration={0}>
              <div className="flex items-center gap-3">
                {socialLinks.map((link) => (
                  <Tooltip key={link.name}>
                    <TooltipTrigger asChild>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon-btn inline-flex items-center justify-center w-9 h-9 rounded-lg"
                        aria-label={link.name}
                      >
                        <link.icon size={18} />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>{link.name}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row md:justify-between gap-2 text-sm"
          style={{
            borderTop: "1px solid var(--neutral-700)",
            color: "var(--neutral-400)",
          }}
        >
          <p>
            Salary Comparison Tool by GooCampus World · Free forever · For
            planning purposes only
          </p>
          <p>Data verified Feb 2026. Always verify with official sources.</p>
        </div>
      </div>
    </footer>
  );
}
