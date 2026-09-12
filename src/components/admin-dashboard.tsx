"use client";

import Link from "next/link";
import { LogOut, Pencil, Plus, Save, Store, Trash2, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
const emptyProduct: Omit<Product, "id"> = { name: "", brand: "", description: "", weight: "500 g", price: 0, stock: 0, active: true, image_url: null, accent: "#2f7057" };

export function AdminDashboard({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const formProduct = editing ?? (creating ? { ...emptyProduct, id: "" } : null);
  const totalStock = useMemo(() => products.reduce((sum, product) => sum + product.stock, 0), [products]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const data = new FormData(event.currentTarget);
    try {
      const supabase = createClient();
      let imageUrl = formProduct?.image_url ?? null;
      const image = data.get("image");
      if (image instanceof File && image.size > 0) {
        const extension = image.name.split(".").pop() || "jpg";
        const path = `${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage.from("products").upload(path, image, { upsert: false });
        if (uploadError) throw uploadError;
        imageUrl = supabase.storage.from("products").getPublicUrl(path).data.publicUrl;
      }
      const payload = { name: String(data.get("name")), brand: String(data.get("brand")), description: String(data.get("description")), weight: String(data.get("weight")), price: Number(data.get("price")), stock: Number(data.get("stock")), active: data.get("active") === "on", accent: String(data.get("accent")), image_url: imageUrl };
      if (editing) {
        const { data: updated, error } = await supabase.from("products").update(payload).eq("id", editing.id).select().single();
        if (error) throw error;
        setProducts((current) => current.map((product) => product.id === editing.id ? updated as Product : product));
      } else {
        const { data: created, error } = await supabase.from("products").insert(payload).select().single();
        if (error) throw error;
        setProducts((current) => [created as Product, ...current]);
      }
      setEditing(null); setCreating(false); setMessage("Producto guardado correctamente."); router.refresh();
    } catch (err) { setMessage(err instanceof Error ? err.message : "No se pudo guardar el producto."); }
    finally { setBusy(false); }
  }

  async function remove(product: Product) {
    if (!window.confirm(`¿Eliminar ${product.brand} ${product.name}?`)) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from("products").delete().eq("id", product.id);
      if (error) throw error;
      setProducts((current) => current.filter((item) => item.id !== product.id));
    } catch (err) { setMessage(err instanceof Error ? err.message : "No se pudo eliminar."); }
  }

  async function logout() { const supabase = createClient(); await supabase.auth.signOut(); router.replace("/admin/login"); router.refresh(); }

  return <div className="admin-shell"><header className="admin-top"><nav className="shell admin-nav"><Link href="/"><Store size={20} /> <strong>Entre Yerbas</strong></Link><button className="icon-button" onClick={logout}><LogOut size={17} /> Cerrar sesión</button></nav></header><main className="shell admin-main"><div className="admin-heading"><div><span className="eyebrow">Gestión del catálogo</span><h1 className="display">Productos</h1></div><button className="primary" onClick={() => setCreating(true)}><Plus size={19} /> Agregar producto</button></div>{message && <div className="notice">{message}</div>}<section className="stats"><div className="stat"><span>Productos cargados</span><strong>{products.length}</strong></div><div className="stat"><span>Unidades en stock</span><strong>{totalStock}</strong></div><div className="stat"><span>Productos visibles</span><strong>{products.filter((product) => product.active).length}</strong></div></section><section className="admin-card"><div className="table-wrap"><table className="admin-table"><thead><tr><th>Producto</th><th>Presentación</th><th>Precio</th><th>Stock</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><div className="table-product"><span className="swatch" style={{ background: product.accent }} /><div><strong>{product.brand}</strong><div>{product.name}</div></div></div></td><td>{product.weight}</td><td><strong>{money.format(product.price)}</strong></td><td>{product.stock}</td><td><span className="stock">{product.active ? "Visible" : "Oculto"}</span></td><td><div className="actions"><button className="action" onClick={() => setEditing(product)}><Pencil size={15} /> Editar</button><button className="action danger" onClick={() => remove(product)} aria-label={`Eliminar ${product.brand}`}><Trash2 size={15} /></button></div></td></tr>)}</tbody></table></div></section></main>{formProduct && <div className="modal-wrap"><form className="modal" onSubmit={save}><div className="drawer-head"><h2 className="display">{editing ? "Editar producto" : "Nuevo producto"}</h2><button type="button" className="close" onClick={() => { setEditing(null); setCreating(false); }} aria-label="Cerrar"><X /></button></div><div className="form-grid"><div className="form-field"><label>Marca</label><input name="brand" defaultValue={formProduct.brand} required /></div><div className="form-field"><label>Nombre o variedad</label><input name="name" defaultValue={formProduct.name} required /></div><div className="form-field"><label>Presentación</label><select name="weight" defaultValue={formProduct.weight}><option>500 g</option><option>1 kg</option><option>2 kg</option></select></div><div className="form-field"><label>Precio</label><input name="price" type="number" min="0" step="1" defaultValue={formProduct.price} required /></div><div className="form-field"><label>Stock</label><input name="stock" type="number" min="0" step="1" defaultValue={formProduct.stock} required /></div><div className="form-field"><label>Color identificador</label><input name="accent" type="color" defaultValue={formProduct.accent} /></div><div className="form-field full"><label>Descripción</label><textarea name="description" defaultValue={formProduct.description} required /></div><div className="form-field full"><label>Foto del producto</label><input name="image" type="file" accept="image/png,image/jpeg,image/webp" /></div><label className="form-field full check"><input name="active" type="checkbox" defaultChecked={formProduct.active} /> Mostrar producto en la tienda</label></div><div className="form-actions"><button type="button" className="secondary" onClick={() => { setEditing(null); setCreating(false); }}>Cancelar</button><button className="primary" disabled={busy}><Save size={17} /> {busy ? "Guardando..." : "Guardar"}</button></div></form></div>}</div>;
}
