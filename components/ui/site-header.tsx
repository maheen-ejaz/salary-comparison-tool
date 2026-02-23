"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetFooter } from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { MenuToggle } from "@/components/ui/menu-toggle";
import { COUNTRIES } from "@/lib/config/countries";

const availableCountries = COUNTRIES.filter((c) => c.available);

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const isCountryPage = pathname !== "/" && pathname !== "";

  return (
    <header
      className="sticky top-0 z-50 w-full border-b backdrop-blur-lg"
      style={{
        background: "rgba(26, 26, 46, 0.95)",
        borderColor: "var(--neutral-700)",
      }}
    >
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ background: "var(--accent-400)", color: "var(--primary-900)" }}
          >
            GC
          </div>
          <span className="text-white font-semibold text-base sm:text-lg tracking-tight">
            Salary Comparison Tool by GooCampus World
          </span>
        </Link>

        {/* Desktop nav */}
        {isCountryPage ? (
          <Link
            href="/"
            className="hidden items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors lg:flex"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        ) : (
          <div className="hidden items-center gap-2 lg:flex">
            {/* Countries dropdown */}
            <div className="relative group">
              <button
                className={buttonVariants({
                  variant: "ghost",
                  className:
                    "text-white/80 hover:text-white hover:bg-white/10 gap-1",
                })}
              >
                Countries
                <ChevronDown
                  size={14}
                  className="transition-transform group-hover:rotate-180"
                />
              </button>
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150 absolute top-full right-0 pt-2">
                <div
                  className="rounded-lg border shadow-lg py-2 min-w-[200px] backdrop-blur-md"
                  style={{
                    background: "rgba(26, 26, 46, 0.80)",
                    borderColor: "rgba(255, 255, 255, 0.12)",
                  }}
                >
                  {availableCountries.map((country) => (
                    <Link
                      key={country.code}
                      href={`/${country.code}`}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm transition-colors hover:bg-white/10"
                      style={{ color: "var(--neutral-300)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--neutral-300)";
                      }}
                    >
                      <span className="text-base">{country.flag}</span>
                      {country.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Features link */}
            <a
              className={buttonVariants({
                variant: "ghost",
                className:
                  "text-white/80 hover:text-white hover:bg-white/10",
              })}
              href="/#features"
            >
              Features
            </a>

            {/* CTA */}
            <a
              href="/#countries"
              className={buttonVariants({
                variant: "default",
                size: "sm",
                className: "ml-1",
              })}
              style={{
                background: "var(--cta-gradient)",
                color: "white",
              }}
            >
              Explore Countries
            </a>
          </div>
        )}

        {/* Mobile hamburger + sheet */}
        <Sheet open={open} onOpenChange={setOpen}>
          <Button
            size="icon"
            variant="outline"
            className="lg:hidden border-white/20 bg-transparent hover:bg-white/10"
            onClick={() => setOpen(!open)}
          >
            <MenuToggle
              strokeWidth={2.5}
              open={open}
              onOpenChange={setOpen}
              className="size-6 text-white"
            />
          </Button>
          <SheetContent
            className="gap-0 backdrop-blur-lg"
            showClose={false}
            side="left"
          >
            <div className="grid gap-y-1 overflow-y-auto px-4 pt-12 pb-5">
              {isCountryPage ? (
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className={buttonVariants({
                    variant: "ghost",
                    className: "justify-start",
                  })}
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Home
                </Link>
              ) : (
                <>
                  {/* Countries section */}
                  <p
                    className="px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--neutral-400)" }}
                  >
                    Countries
                  </p>
                  {availableCountries.map((country) => (
                    <Link
                      key={country.code}
                      href={`/${country.code}`}
                      onClick={() => setOpen(false)}
                      className={buttonVariants({
                        variant: "ghost",
                        className: "justify-start gap-2.5",
                      })}
                    >
                      <span className="text-base">{country.flag}</span>
                      {country.name}
                    </Link>
                  ))}

                  {/* Features link */}
                  <div
                    className="my-2"
                    style={{ borderTop: "1px solid var(--neutral-200)" }}
                  />
                  <a
                    className={buttonVariants({
                      variant: "ghost",
                      className: "justify-start",
                    })}
                    href="/#features"
                    onClick={() => setOpen(false)}
                  >
                    Features
                  </a>
                </>
              )}
            </div>
            {!isCountryPage && (
              <SheetFooter>
                <a
                  href="/#countries"
                  onClick={() => setOpen(false)}
                  className={buttonVariants({ variant: "default" })}
                  style={{
                    background: "var(--cta-gradient)",
                    color: "white",
                  }}
                >
                  Explore Countries
                </a>
              </SheetFooter>
            )}
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
