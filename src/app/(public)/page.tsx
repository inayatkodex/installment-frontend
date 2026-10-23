import { redirect } from "next/navigation";
import { ROUTES } from "@/constant/appRoutes";

// Home opens the shopkeeper login. (A landing page can be added here later.)
export default function HomePage() {
  redirect(ROUTES.SHOP.LOGIN);
}
