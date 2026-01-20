import { redirect } from "next/navigation";

export default function TenantsPage() {
  redirect("/portfolio?tab=tenant");
}
