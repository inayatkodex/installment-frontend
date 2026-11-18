import Link from "next/link";
import { ArrowLeft, CircleHelp, type LucideIcon } from "lucide-react";
import { ROUTES } from "@/constant/appRoutes";
import BrandLogo from "@/components/common/BrandLogo";
import "./InfoPage.scss";

export interface InfoSection {
  icon: LucideIcon;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

interface Props {
  heroIcon: LucideIcon;
  heroTitle: string;
  heroSubtitle: string;
  sections: InfoSection[];
  contactTitle: string;
  contactBody: string;
}

/** Shared shell for public info pages (About Us, Privacy Policy, Terms). */
const InfoPage = ({
  heroIcon: HeroIcon,
  heroTitle,
  heroSubtitle,
  sections,
  contactTitle,
  contactBody,
}: Props) => (
  <main className="info-page">
    <header className="info-top">
      <div className="info-container info-top-inner">
        <Link href={ROUTES.HOME.INDEX} className="info-logo" aria-label="QistPro">
          <BrandLogo size={30} />
        </Link>
        <Link href={ROUTES.HOME.INDEX} className="info-back">
          <ArrowLeft size={18} aria-hidden="true" />
          Wapas
        </Link>
      </div>
    </header>

    <section className="info-hero">
      <div className="info-container">
        <span className="info-hero-icon" aria-hidden="true">
          <HeroIcon size={32} />
        </span>
        <h1>{heroTitle}</h1>
        <p>{heroSubtitle}</p>
      </div>
    </section>

    <section className="info-body">
      <div className="info-container">
        {sections.map(({ icon: Icon, title, paragraphs, bullets }) => (
          <article className="info-card" key={title}>
            <div className="info-card-head">
              <span className="info-card-icon" aria-hidden="true">
                <Icon size={20} />
              </span>
              <h2>{title}</h2>
            </div>
            {paragraphs?.map((text) => (
              <p key={text}>{text}</p>
            ))}
            {bullets && (
              <ul>
                {bullets.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            )}
          </article>
        ))}

        <div className="info-contact">
          <CircleHelp size={22} aria-hidden="true" />
          <div>
            <strong>{contactTitle}</strong>
            <p>{contactBody}</p>
          </div>
        </div>
      </div>
    </section>

    <footer className="info-footer">
      <div className="info-container">
        <p>© {new Date().getFullYear()} QistPro. Saare haqooq mahfooz.</p>
      </div>
    </footer>
  </main>
);

export default InfoPage;
