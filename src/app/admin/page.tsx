import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";
import { createClient } from "@/lib/supabase/server";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/admin/login");
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", data.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login");
  const products = await getProducts(true);
  return <AdminDashboard initialProducts={products} />;
}
