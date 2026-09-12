import { sampleProducts } from "./sample-products";
import { createClient } from "./supabase/server";
import type { Product } from "./types";

export async function getProducts(includeInactive = false): Promise<Product[]> {
  const supabase = await createClient();
  if (!supabase) return sampleProducts;
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (!includeInactive) query = query.eq("active", true);
  const { data, error } = await query;
  if (error) throw new Error("No pudimos cargar el catálogo en este momento.");
  if (!data) return [];
  return data as Product[];
}
