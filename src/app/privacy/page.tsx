import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Ban,
  ChartColumn,
  CircleHelp,
  FolderOpen,
  IdCard,
  Info,
  Lock,
  RefreshCw,
  ShieldCheck,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/constant/appRoutes";
import BrandLogo from "@/components/common/BrandLogo";
import "./privacy.scss";

const TITLE = "Privacy Policy | Installment Pro";
const DESCRIPTION =
  "Installment Pro kin maloomat ko collect karta hai, unhein kaise istemal aur mehfooz rakhta hai. Poori privacy policy Roman Urdu mein.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    locale: "en_PK",
    siteName: "Installment Pro",
  },
};

interface PolicySection {
  icon: LucideIcon;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

const SECTIONS: PolicySection[] = [
  {
    icon: Info,
    title: "Ye policy kis bare mein hai",
    paragraphs: [
      "Installment Pro aap ki dukaan ka installment hisaab rakhne wali app aur website hai. Ye Privacy Policy batati hai ke hum kaun sa data collect karte hain, usay kaise istemal karte hain, aur usay kaise mehfooz rakhte hain.",
      "Installment Pro istemal karne ka matlab hai ke aap is policy se ittefaq rakhte hain.",
    ],
  },
  {
    icon: FolderOpen,
    title: "Hum kaun sa data collect karte hain",
    bullets: [
      "Dukaan ki maloomat: dukaan ka naam, malik ka naam, mobile number, CNIC aur address.",
      "Login maloomat: mobile number aur password (password mehfooz tareeqe se save hota hai).",
      "Customer records jo aap khud enter karte hain: naam, phone, CNIC, address, saman ki tafseel aur qiston ka schedule.",
      "Payments ka record: kis customer ne kab kitni qist di.",
      "Documents: customer ki CNIC ya photo jo aap app ya website ke zariye save karte hain.",
    ],
  },
  {
    icon: ChartColumn,
    title: "Data kaise istemal hota hai",
    bullets: [
      "Aap ka hisaab dikhane aur qiston ka schedule banane ke liye.",
      "Aaj ki wasooli, late customers aur mahine ki report tayyar karne ke liye.",
      "Aap ke login aur account ko mehfooz rakhne ke liye.",
      "Aap ki madad aur support ke liye.",
    ],
  },
  {
    icon: IdCard,
    title: "Documents aur photos ki hifazat",
    paragraphs: [
      "Customer ki CNIC ya photo sirf aap ki dukaan ke account se juri hoti hai. Inhein sirf aap dekh sakte hain. Hum in documents ko kisi aur maqsad ke liye istemal nahi karte.",
    ],
  },
  {
    icon: Ban,
    title: "Hum aap ka data kisi ko nahi dete",
    paragraphs: [
      "Doosri dukaan aap ka ya aap ke customers ka data nahi dekh sakti — har dukaan ka record alag rakha jata hai.",
      "Hum aap ka data kisi third party ko bechte ya kiraye par nahi dete.",
    ],
  },
  {
    icon: Lock,
    title: "Security",
    bullets: [
      "Har dukaan ka data alag aur mehfooz rakha jata hai.",
      "Login mobile number aur password se hota hai; session khatam hone par dobara login zaroori hai.",
      "Aap ka password encrypted (coded) tareeqe se save kiya jata hai.",
    ],
  },
  {
    icon: Trash2,
    title: "Data delete karwana",
    paragraphs: [
      "Agar aap apna account aur data delete karwana chahte hain to apne dukaan admin se rabta karein. Tasdeeq ke baad aap ka data delete kar diya jayega.",
    ],
  },
  {
    icon: RefreshCw,
    title: "Policy mein tabdili",
    paragraphs: [
      "Zaroorat par ye policy update ho sakti hai. Ahem tabdiliyon ki ittila app aur website par di jayegi.",
    ],
  },
];

const PrivacyPolicyPage = () => (
  <main className="policy">
    <header className="policy-top">
      <div className="policy-container policy-top-inner">
        <Link href={ROUTES.HOME.INDEX} className="policy-logo" aria-label="Installment Pro">
          <BrandLogo size={30} />
        </Link>
        <Link href={ROUTES.HOME.INDEX} className="policy-back">
          <ArrowLeft size={18} aria-hidden="true" />
          Wapas
        </Link>
      </div>
    </header>

    <section className="policy-hero">
      <div className="policy-container">
        <span className="policy-shield" aria-hidden="true">
          <ShieldCheck size={32} />
        </span>
        <h1>Aap ki maloomat, aap ke paas</h1>
        <p>Aakhri update: {new Date().getFullYear()}</p>
      </div>
    </section>

    <section className="policy-body">
      <div className="policy-container">
        {SECTIONS.map(({ icon: Icon, title, paragraphs, bullets }) => (
          <article className="policy-card" key={title}>
            <div className="policy-card-head">
              <span className="policy-card-icon" aria-hidden="true">
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

        <div className="policy-contact">
          <CircleHelp size={22} aria-hidden="true" />
          <div>
            <strong>Koi sawal hai?</strong>
            <p>
              Privacy ya aap ke data ke bare mein koi bhi sawal ho to apne
              dukaan admin se rabta karein.
            </p>
          </div>
        </div>
      </div>
    </section>

    <footer className="policy-footer">
      <div className="policy-container">
        <p>
          © {new Date().getFullYear()} Installment Pro. Saare haqooq mahfooz.
        </p>
      </div>
    </footer>
  </main>
);

export default PrivacyPolicyPage;
