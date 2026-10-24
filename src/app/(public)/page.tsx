import type { Metadata } from "next";
import LandingPage from "@/components/landing/page";

const TITLE = "Installment Pro | Installment ka hisaab, ab mobile par";
const DESCRIPTION =
  "Aaj kis se qist leni hai, kaun late hai, kitna baaki hai. Dukaandaron ke liye installment ka hisaab, sab kuch ek nazar mein. Na register, na bhool, na bahana.";

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

export default LandingPage;
