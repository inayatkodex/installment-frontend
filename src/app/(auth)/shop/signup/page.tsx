import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import SignupForm from "@/components/shop/signup-form/SignupForm";
import { ROUTES } from "@/constant/appRoutes";
import "./signup.scss";

export const metadata = { title: "Signup · Installment Pro" };

const ShopSignupPage = () => (
  <main className="shop-signup">
    <header className="shop-signup-head">
      <Link href={ROUTES.SHOP.LOGIN} aria-label="Login par wapas jayein"><ChevronLeft size={24} /></Link>
      <strong>Apni dukaan register karein</strong>
      <span className="ur" lang="ur">دکان رجسٹر کریں</span>
    </header>
    <div className="shop-signup-body"><SignupForm /></div>
  </main>
);

export default ShopSignupPage;
