import type { Metadata } from "next";
import {
  Ban,
  ChartColumn,
  FolderOpen,
  IdCard,
  Info,
  Lock,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import InfoPage, { type InfoSection } from "@/components/common/InfoPage/InfoPage";

const TITLE = "Privacy Policy | QistPro";
const DESCRIPTION =
  "QistPro kin maloomat ko collect karta hai, unhein kaise istemal aur mehfooz rakhta hai. Poori privacy policy Roman Urdu mein.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    locale: "en_PK",
    siteName: "QistPro",
  },
};

const SECTIONS: InfoSection[] = [
  {
    icon: Info,
    title: "Ye policy kis bare mein hai",
    paragraphs: [
      "QistPro aap ki dukaan ka installment hisaab rakhne wali app aur website hai. Ye Privacy Policy batati hai ke hum kaun sa data collect karte hain, usay kaise istemal karte hain, aur usay kaise mehfooz rakhte hain.",
      "QistPro istemal karne ka matlab hai ke aap is policy se ittefaq rakhte hain.",
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
  <InfoPage
    heroIcon={ShieldCheck}
    heroTitle="Aap ki maloomat, aap ke paas"
    heroSubtitle={`Aakhri update: ${new Date().getFullYear()}`}
    sections={SECTIONS}
    contactTitle="Koi sawal hai?"
    contactBody="Privacy ya aap ke data ke bare mein koi bhi sawal ho to apne dukaan admin se rabta karein."
  />
);

export default PrivacyPolicyPage;
