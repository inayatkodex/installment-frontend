"use client";

import Link from "next/link";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/constant/appRoutes";
import { TOKEN_KEY } from "@/store/ApiServices/config";
import LogoMark from "./LogoMark";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "Kaise kaam karta hai" },
  { href: "#faq", label: "Sawal jawab" },
];

const LandingNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!Cookies.get(TOKEN_KEY));
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`lp-nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="lp-container lp-nav-inner">
        <Link href={ROUTES.HOME.INDEX} className="lp-logo" aria-label="Installment Pro, home">
          <LogoMark size={38} />
          <span>
            Installment <b>Pro</b>
          </span>
        </Link>

        <nav className="lp-nav-links" aria-label="Page sections">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="lp-nav-actions">
          {loggedIn ? (
            <Link href={ROUTES.SHOP.DASHBOARD} className="lp-btn lp-btn-primary">
              Dashboard kholein <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link href={ROUTES.SHOP.LOGIN} className="lp-btn lp-btn-ghost">
                Login
              </Link>
              <Link href={ROUTES.SHOP.SIGNUP} className="lp-btn lp-btn-primary lp-nav-signup">
                Free shuru karein
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default LandingNav;
