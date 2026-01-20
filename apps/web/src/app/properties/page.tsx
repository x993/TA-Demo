import { redirect } from "next/navigation";

export default function PropertiesPage() {
  redirect("/portfolio?tab=property");
}
