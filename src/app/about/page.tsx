import type { Metadata } from "next";
import { Lightbulb, ListChecks, Lock, Store, Users } from "lucide-react";
import InfoPage, { type InfoSection } from "@/components/common/InfoPage/InfoPage";

const TITLE = "About Us | QistPro";
const DESCRIPTION =
  "QistPro chhoti aur darmiyani dukaandon ke liye installment hisaab rakhne wali app aur website hai. Yahan jaanen hum kis liye banaye aur aap kya kar sakte hain.";

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
    icon: Lightbulb,
    title: "Hum kis liye banaye",
    paragraphs: [
      "QistPro chhoti aur darmiyani dukaandon ke liye banayi gayi hai jo saman qiston par bechte hain. Kaghaz ke register ki jagah ab aap ka poora hisaab mobile aur web par mehfooz rehta hai.",
      "Maqsad aasan hai: kis customer ne kitne paise dene hain aur kis qist ki tareekh aayi hai — ye sab aik jagah saaf nazar aaye.",
    ],
  },
  {
    icon: ListChecks,
    title: "Aap kya kar sakte hain",
    bullets: [
      "Naye customer ka record, CNIC aur tasveer ke saath mehfooz karein.",
      "Saman aur qiston ka schedule banayein — poora hisaab khud-ba-khud tayyar ho jata hai.",
      "Aaj ki wasooli aik nazar mein dekhein aur qist wasool karte hi record update karein.",
      "Late customers ki list dekhein taake waqt par yaad dilaya ja sake.",
      "Mahine ki report aur dukaan ki kaarkardagi (status) dekhein.",
    ],
  },
  {
    icon: Users,
    title: "Ye app kis ke liye hai",
    paragraphs: [
      "Ye app un dukaandaron ke liye hai jo mobile, electronics, kapre, bartan ya kisi bhi qism ka saman qiston par bechte hain — chahe dukaan chhoti ho ya bari.",
    ],
  },
  {
    icon: Lock,
    title: "Aap ka data mehfooz hai",
    paragraphs: [
      "Har dukaan ka record alag rakha jata hai aur sirf usi dukaan ko nazar aata hai. Aap ke customers ki maloomat kisi doosri dukaan ya third party ke saath share nahi ki jati.",
    ],
  },
];

const AboutUsPage = () => (
  <InfoPage
    heroIcon={Store}
    heroTitle="Dukaandaron ke liye installment ka hisaab"
    heroSubtitle="QistPro — aap ki dukaan ka digital khata"
    sections={SECTIONS}
    contactTitle="Madad chahiye?"
    contactBody="App ke istemal ya apne account ke bare mein koi bhi sawal ho to apne dukaan admin se rabta karein."
  />
);

export default AboutUsPage;
