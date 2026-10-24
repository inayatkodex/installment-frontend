import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChartColumn,
  CircleCheck,
  Clock,
  IdCard,
  Lock,
  Store,
  Undo2,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/constant/appRoutes";
import Faq from "@/components/landing/Faq";
import LandingNav from "@/components/landing/LandingNav";
import LogoMark from "@/components/landing/LogoMark";
import PhoneMockup from "@/components/landing/PhoneMockup";
import "./landing.scss";

const TITLE = "Installment Pro | Installment ka hisaab, ab mobile par";
const DESCRIPTION =
  "Aaj kis se qist leni hai, kaun late hai, kitna baaki hai. Dukaandaron ke liye installment ka hisaab, sab kuch ek nazar mein. Na register, na bhool, na bahana.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", locale: "en_PK", siteName: "Installment Pro" },
};

/** Keep in sync with the monthly fee on the backend (Shop.monthlyFee). */
const MONTHLY_FEE = "Rs. 2,500";

const PROBLEMS = [
  "Qist ki tareekh bhool jana",
  "Kis ne kitna diya, har dafa dobara jorna",
  "Customer kehta hai: “Maine to de diye the”",
  "Register kho jaye ya bheeg jaye to sab khatam",
];

const SOLUTIONS = [
  "Har subah aaj ki wasooli ki list tayyar",
  "Late customers ek jagah, din ginti ke sath",
  "Har payment ka record, galti ho to undo",
  "Data mehfooz, jab chahein dekh lein",
];

type Tone = "blue" | "orange" | "green" | "purple" | "teal" | "pink";
interface Card {
  icon: LucideIcon;
  tone: Tone;
  title: string;
  text: string;
}

const FEATURES: Card[] = [
  { icon: Wallet, tone: "blue", title: "Aaj ki wasooli", text: "Subah kholte hi dekhein aaj kis se kitni qist leni hai." },
  { icon: Clock, tone: "orange", title: "Late customers", text: "Kaun kitne din se late hai, ek list mein. Sab se zyada late sab se upar." },
  { icon: CircleCheck, tone: "green", title: "Qist receive karein", text: "Ek tap, amount likhein, ho gaya. Galti ho to aaj ke aaj undo." },
  { icon: Users, tone: "purple", title: "Customer ka poora record", text: "Naam, CNIC, address, saman aur qiston ka poora schedule." },
  { icon: IdCard, tone: "teal", title: "CNIC aur photo save", text: "Customer ke documents ki photo kheench kar mehfooz karein." },
  { icon: ChartColumn, tone: "pink", title: "Mahine ki report", text: "Kitna lena tha, kitna mila, kitna baaki. Percent ke sath." },
];

const STEPS = [
  { title: "Signup karein", text: "Dukaan ka naam, mobile aur CNIC likhein. Approval ke baad login shuru." },
  { title: "Customer aur saman add karein", text: "Total, advance aur mahine likhein. Qiston ka schedule khud ban jata hai." },
  { title: "Qist receive karein", text: "Jis din qist aaye, Receive dabayein. Baaqi hisaab app sambhal leti hai." },
];

const REPORT_POINTS = [
  "Lena tha, mila, baaki: teeno ek jagah",
  "Kitni qistein paid, kitni pending",
  "Kaun se customers overdue hain",
];

const TRUST: Card[] = [
  { icon: Store, tone: "blue", title: "Har dukaan ka alag record", text: "Koi doosri dukaan aap ka data nahi dekh sakti. Sirf aap ka account, aap ka hisaab." },
  { icon: Lock, tone: "green", title: "Mehfooz login", text: "Mobile number aur password ke sath. Session khatam ho to dobara login zaroori." },
  { icon: Undo2, tone: "orange", title: "Undo, delete nahi", text: "Payment galat likh di to wapas karein. Record barkarar rehta hai, hisaab saaf." },
];

const FAQS = [
  { q: "Kya yeh free hai?", a: `Signup free hai. Dukaan active hone ke baad mahana fee ${MONTHLY_FEE} hai. Koi chhupa kharcha nahi.` },
  { q: "Mujhe computer chahiye?", a: "Nahi. Sirf mobile aur internet. Saari screens mobile ke liye banai gayi hain." },
  { q: "Signup ke baad kab shuru kar sakta hoon?", a: "Admin aap ki registration dekh kar approve karta hai. Approve hote hi aap login kar sakte hain." },
  { q: "Agar payment galat likh di?", a: "Aaj ki payment ko “Wapas karein” se undo kar sakte hain. Record delete nahi hota." },
  { q: "Customer ki photo aur CNIC safe hain?", a: "Documents sirf aap ki dukaan ke account mein nazar aate hain." },
];

const SectionHead = ({ eyebrow, title, text, id }: { eyebrow: string; title: string; text?: string; id: string }) => (
  <div className="lp-head">
    <p className="lp-eyebrow">{eyebrow}</p>
    <h2 id={id}>{title}</h2>
    {text && <p className="lp-sub">{text}</p>}
  </div>
);

const IconTile = ({ card, size = 26 }: { card: Card; size?: number }) => {
  const Icon = card.icon;
  return (
    <span className={`lp-icon tone-${card.tone}`}>
      <Icon size={size} aria-hidden="true" />
    </span>
  );
};

const LandingPage = () => (
  <div className="lp">
    <LandingNav />

    <main>
      {/* ---------- HERO ---------- */}
      <section className="lp-hero" aria-labelledby="lp-hero-title">
        <div className="lp-container lp-hero-grid">
          <div className="lp-hero-copy">
            <p className="lp-badge">
              <span className="lp-dot" aria-hidden="true" />
              Dukaandaron ke liye, dukaandaron jaisa simple
            </p>
            <h1 id="lp-hero-title">
              Installment ka hisaab, <span>ab mobile par.</span>
            </h1>
            <p className="lp-lead">
              Aaj kis se qist leni hai, kaun late hai, kitna baaki hai. Sab kuch ek nazar mein. Na register, na bhool, na bahana.
            </p>
            <div className="lp-actions">
              <Link href={ROUTES.SHOP.SIGNUP} className="lp-btn lp-btn-primary lp-btn-lg">
                Free shuru karein <ArrowRight size={20} aria-hidden="true" />
              </Link>
              <Link href={ROUTES.SHOP.LOGIN} className="lp-btn lp-btn-ghost lp-btn-lg">
                Login karein
              </Link>
            </div>
            <ul className="lp-ticks">
              {["Free signup", "2 minute mein shuru", "Sirf mobile chahiye"].map((t) => (
                <li key={t}>
                  <span><Check size={12} strokeWidth={3} aria-hidden="true" /></span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="lp-hero-visual">
            <div className="lp-glow" aria-hidden="true" />
            <PhoneMockup />
            <div className="lp-float lp-float-paid" aria-hidden="true">
              <span className="lp-float-icon green"><Check size={20} aria-hidden="true" /></span>
              <div>
                <b>Rs. 6,000 mil gaye</b>
                <span>Sana Ullah ne qist di</span>
              </div>
            </div>
            <div className="lp-float lp-float-late" aria-hidden="true">
              <span className="lp-float-icon orange"><Clock size={20} aria-hidden="true" /></span>
              <div>
                <b>2 customers late</b>
                <span>Hina Bibi · 12 din se</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- PROBLEM vs SOLUTION ---------- */}
      <section className="lp-section" aria-labelledby="lp-compare-title">
        <div className="lp-container">
          <SectionHead
            id="lp-compare-title"
            eyebrow="Purana tareeqa, naya tareeqa"
            title="Register mein likhna aasan hai. Yaad rakhna mushkil."
            text="Installment Pro wohi kaam karta hai jo aap roz karte hain, bas bhoolne ki gunjaish khatam."
          />
          <div className="lp-compare lp-reveal">
            <article className="lp-compare-card lp-bad">
              <span className="lp-tag">PEHLE</span>
              <h3>Copy aur register mein hisaab</h3>
              <ul>
                {PROBLEMS.map((t) => (
                  <li key={t}>
                    <span className="lp-mark"><X size={14} strokeWidth={3} aria-hidden="true" /></span>
                    {t}
                  </li>
                ))}
              </ul>
            </article>
            <article className="lp-compare-card lp-good">
              <span className="lp-tag">AB</span>
              <h3>Installment Pro ke sath</h3>
              <ul>
                {SOLUTIONS.map((t) => (
                  <li key={t}>
                    <span className="lp-mark"><Check size={14} strokeWidth={3} aria-hidden="true" /></span>
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section id="features" className="lp-section lp-alt" aria-labelledby="lp-features-title">
        <div className="lp-container">
          <SectionHead
            id="lp-features-title"
            eyebrow="Features"
            title="Dukaan chalane wala sab kuch, ek app mein"
            text="Jo kaam aap register aur calculator se karte hain, woh sab ab ek jagah."
          />
          <div className="lp-grid-3">
            {FEATURES.map((f) => (
              <article key={f.title} className="lp-card lp-reveal">
                <IconTile card={f} />
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section id="how" className="lp-section" aria-labelledby="lp-how-title">
        <div className="lp-container">
          <SectionHead
            id="lp-how-title"
            eyebrow="Kaise kaam karta hai"
            title="3 asaan steps mein shuru"
            text="Bina training, bina computer. Pehle din se kaam shuru."
          />
          <ol className="lp-steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className="lp-step lp-reveal">
                <span className="lp-step-no">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- REPORT SHOWCASE ---------- */}
      <section className="lp-band" aria-labelledby="lp-report-title">
        <div className="lp-container lp-band-grid">
          <div className="lp-band-copy">
            <p className="lp-eyebrow">Mahine ki report</p>
            <h2 id="lp-report-title">Poora hisaab, ek nazar mein.</h2>
            <p className="lp-sub">
              Mahine ke ant ka intezaar nahi. Jab chahein dekh lein kitna wasool hua aur kitna baaki hai.
            </p>
            <ul>
              {REPORT_POINTS.map((t) => (
                <li key={t}>
                  <span><Check size={14} strokeWidth={3} aria-hidden="true" /></span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Sample numbers, for illustration only */}
          <div className="lp-report lp-reveal" role="img" aria-label="Sample report: Rs. 1,86,000 mila, Rs. 2,40,000 lena tha, 78 percent collect ho chuka">
            <div className="lp-report-top">
              <b>Is mahine ki wasooli</b>
              <span className="lp-pill">Sample</span>
            </div>
            <div className="lp-report-amount">
              <strong>Rs. 1,86,000</strong>
              <span>Rs. 2,40,000 lena tha</span>
            </div>
            <div className="lp-progress"><span style={{ "--p": "78%" } as CSSProperties} /></div>
            <div className="lp-report-meta">
              <b>78% collect ho chuka</b>
              <span>22% baaki</span>
            </div>
            <div className="lp-report-stats">
              <div className="green"><strong>42</strong><span>Paid qistein</span></div>
              <div className="yellow"><strong>18</strong><span>Pending</span></div>
              <div className="red"><strong>5</strong><span>Overdue customers</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- TRUST ---------- */}
      <section className="lp-section" aria-labelledby="lp-trust-title">
        <div className="lp-container">
          <SectionHead
            id="lp-trust-title"
            eyebrow="Bharosa"
            title="Aap ka data, sirf aap ka"
            text="Customers ki maloomat aur photos ko hum amanat ki tarah rakhte hain."
          />
          <div className="lp-grid-3">
            {TRUST.map((t) => (
              <article key={t.title} className="lp-card lp-card-flat lp-reveal">
                <IconTile card={t} />
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="lp-section lp-alt" aria-labelledby="lp-faq-title">
        <div className="lp-container">
          <SectionHead id="lp-faq-title" eyebrow="Sawal jawab" title="Aksar poochay jane wale sawal" />
          <Faq items={FAQS} />
        </div>
      </section>

      {/* ---------- FINAL CTA ---------- */}
      <section className="lp-cta" aria-labelledby="lp-cta-title">
        <div className="lp-container">
          <div className="lp-cta-card">
            <h2 id="lp-cta-title">Aaj hi purana register band karein.</h2>
            <p>Free signup. 2 minute. Sirf mobile chahiye.</p>
            <div className="lp-actions">
              <Link href={ROUTES.SHOP.SIGNUP} className="lp-btn lp-btn-white lp-btn-lg">
                Free shuru karein <ArrowRight size={20} aria-hidden="true" />
              </Link>
              <Link href={ROUTES.SHOP.LOGIN} className="lp-btn lp-btn-outline lp-btn-lg">
                Login karein
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>

    {/* ---------- FOOTER ---------- */}
    <footer className="lp-footer">
      <div className="lp-container">
        <div className="lp-footer-top">
          <div className="lp-footer-brand">
            <Link href={ROUTES.HOME.INDEX} className="lp-logo" aria-label="Installment Pro, home">
              <LogoMark size={36} />
              <span>
                Installment <b>Pro</b>
              </span>
            </Link>
            <p>Dukaandaron ke liye installment ka hisaab.</p>
          </div>
          <nav className="lp-footer-links" aria-label="Footer">
            <a href="#features">Features</a>
            <a href="#how">Kaise kaam karta hai</a>
            <a href="#faq">Sawal jawab</a>
            <Link href={ROUTES.SHOP.LOGIN}>Login</Link>
            <Link href={ROUTES.SHOP.SIGNUP}>Signup</Link>
          </nav>
        </div>
        <p className="lp-copy">© {new Date().getFullYear()} Installment Pro. Saare haqooq mahfooz.</p>
      </div>
    </footer>
  </div>
);

export default LandingPage;
