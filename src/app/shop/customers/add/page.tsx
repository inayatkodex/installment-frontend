import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import CustomerForm from "@/components/shop/customer-form/CustomerForm";
import { ROUTES } from "@/constant/appRoutes";
import "./add-customer.scss";

export const metadata = { title: "Naya customer · Installment Pro" };

const AddCustomerPage = () => (
  <div className="add-customer-page">
    <Link href={ROUTES.SHOP.CUSTOMERS} className="ac-back"><ChevronLeft size={22} aria-hidden="true" /> Customers</Link>
    <CustomerForm />
  </div>
);

export default AddCustomerPage;
