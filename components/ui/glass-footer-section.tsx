"use client";

import { Instagram, Linkedin, Globe, MapPin, Phone } from "lucide-react";
import { type GlassTheme, getTheme } from "@/lib/glass-theme";

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

export function GlassFooterSection({ theme = "dark" }: { theme?: GlassTheme }) {
  const t = getTheme(theme);

  return (
    <footer
      className="relative snap-start px-6 py-12"
    >
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Main 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-10 text-center">
          {/* Column 1: Branding */}
          <div className="space-y-4">
            <span className="font-semibold text-base tracking-tight" style={{ color: t.textPrimary }}>
              Salary Comparison Tool
            </span>
            <p className="text-sm leading-relaxed" style={{ color: t.textSubtle }}>
              Free forever. Helping you make informed career decisions with
              accurate salary and tax comparisons across countries.
            </p>
          </div>

          {/* Column 2: Contact Us */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: t.textFaint }}>
              Contact Us
            </h3>
            <address className="not-italic space-y-3">
              <div className="flex flex-col items-center gap-1.5">
                <MapPin
                  size={16}
                  className="shrink-0"
                  style={{ color: t.textFaint }}
                />
                <p className="text-sm leading-relaxed" style={{ color: t.textSubtle }}>
                  #138/6, Ground Floor, 10th Main Road, 6th-A Cross,
                  Sadashivanagar, RMV Extension, Near SBI Bank, Bangalore -
                  560080, Karnataka, India
                </p>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <Phone
                  size={16}
                  className="shrink-0"
                  style={{ color: t.textFaint }}
                />
                <a
                  href="tel:08041743956"
                  className="text-sm transition-colors"
                  style={{ color: t.textSubtle }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = t.textPrimary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = t.textSubtle;
                  }}
                >
                  080-41743956
                </a>
              </div>
            </address>
          </div>

          {/* Column 3: Follow Us */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: t.textFaint }}>
              Follow Us
            </h3>
            <div className="flex items-center justify-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
                  style={{
                    background: t.socialIconBg,
                    border: `1px solid ${t.socialIconBorder}`,
                    color: t.textMuted,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = t.socialIconBgHover;
                    e.currentTarget.style.borderColor = t.socialIconBorderHover;
                    e.currentTarget.style.color = t.textPrimary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = t.socialIconBg;
                    e.currentTarget.style.borderColor = t.socialIconBorder;
                    e.currentTarget.style.color = t.textMuted;
                  }}
                  aria-label={link.name}
                >
                  <link.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col items-center gap-2 text-sm"
          style={{
            borderTop: `1px solid ${t.footerDivider}`,
            color: t.textFaint,
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
