import type { Metadata } from "next";
import {
  Ban,
  Cloud,
  FileText,
  Folder,
  Info,
  RefreshCw,
  UserRound,
} from "lucide-react";
import InfoPage, { type InfoSection } from "@/components/common/InfoPage/InfoPage";

const TITLE = "Terms and Conditions | QistPro";
const DESCRIPTION =
  "QistPro istemal karne ki shartein — account, data, istemal ki hadd aur zimmedari ke bare mein Roman Urdu mein tafseel.";

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
    title: "In shartein ka maqsad",
    paragraphs: [
      "Ye Terms and Conditions batati hain ke QistPro app istemal karne par aap aur hum par kya zimmedariyan aati hain.",
      "App istemal karne ka matlab hai ke aap in shartein se ittefaq rakhte hain.",
    ],
  },
  {
    icon: UserRound,
    title: "Account aur login",
    bullets: [
      "Aap ka account aap ke mobile number se juri hoti hai; mobile number aur password mehfooz rakhein.",
      "Apna password kisi ke saath share na karein. Aap ke account se hone wale tamam kaam aap ki zimmedari hain.",
      "Agar shak ho ke kisi ne aap ka password jaanta hai to foran password change karein.",
    ],
  },
  {
    icon: Folder,
    title: "Aap ka data aur records",
    bullets: [
      "Customer records, tasveerein aur qiston ki maloomat jo aap enter karte hain, uski durusti aap ki zimmedari hai.",
      "App sirf hisaab rakhne mein madad karta hai; qist wasool karne ki zimmedari aap ki apni hai.",
      "App mein dikhaya gaya hisaab aap ke enter kiye gaye data par mabni hota hai.",
    ],
  },
  {
    icon: Ban,
    title: "Istemaal ki hadd",
    bullets: [
      "App ko kisi gair-qanooni ya dhoke-baaz kaam ke liye istemal na karein.",
      "App ka data chori chhupe nikalne ya kisi ka nuqsan pohanchane ki koshish na karein.",
      "Hum zaroorat par app ke features ya tareeqa-e-kaar mein tabdili kar sakte hain.",
    ],
  },
  {
    icon: Cloud,
    title: "Service aur zimmedari",
    paragraphs: [
      "Hum koshish karte hain ke app hamesha theek chale, lekin internet ya technical masail ki soorat mein waqfa-e-kaar ho sakta hai.",
      "Aap ka data mehfooz tareeqe se save karne ki koshish ki jati hai, magar har qism ke nuqsan ki zamanat nahi di ja sakti.",
    ],
  },
  {
    icon: RefreshCw,
    title: "Shartein mein tabdili",
    paragraphs: [
      "Zaroorat par ye shartein update ho sakti hain. Ahem tabdiliyon ki ittila app par di jayegi.",
    ],
  },
];

const TermsAndConditionsPage = () => (
  <InfoPage
    heroIcon={FileText}
    heroTitle="Istemaal ki shartein"
    heroSubtitle={`Aakhri update: ${new Date().getFullYear()}`}
    sections={SECTIONS}
    contactTitle="Koi sawal hai?"
    contactBody="In shartein ke bare mein koi bhi sawal ho to apne dukaan admin se rabta karein."
  />
);

export default TermsAndConditionsPage;
