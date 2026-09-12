"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram, Leaf, Minus, Plus, Search, ShieldCheck, ShoppingBag, Sparkles, Truck, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";

type CartLine = { product: Product; quantity: number };
const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export function Storefront({ initialProducts }: { initialProducts: Product[] }) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("Todas");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const brands = useMemo(() => ["Todas", ...Array.from(new Set(initialProducts.map((p) => p.brand))).sort()], [initialProducts]);
  const products = useMemo(() => initialProducts.filter((product) => {
    const term = query.toLowerCase();
    return (brand === "Todas" || product.brand === brand) && `${product.brand} ${product.name} ${product.weight}`.toLowerCase().includes(term);
  }), [brand, initialProducts, query]);
  const quantity = cart.reduce((sum, line) => sum + line.quantity, 0);
  const total = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  function add(product: Product) {
    setCart((current) => {
      const found = current.find((line) => line.product.id === product.id);
      return found ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { product, quantity: 1 }];
    });
    setCartOpen(true);
  }
  function change(id: string, amount: number) {
    setCart((current) => current.map((line) => line.product.id === id ? { ...line, quantity: line.quantity + amount } : line).filter((line) => line.quantity > 0));
  }
  function sendOrder() {
    const detail = cart.map(({ product, quantity: itemQuantity }) => `• ${itemQuantity} x ${product.brand} ${product.name} (${product.weight}) — ${money.format(product.price * itemQuantity)}`).join("\n");
    const message = `¡Hola Entre Yerbas! Quiero realizar este pedido:\n\n${detail}\n\nTotal estimado: ${money.format(total)}\n\n¿Me confirman disponibilidad y forma de entrega?`;
    window.open(`https://wa.me/5492474442232?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return <>
    <header className="site-header"><nav className="shell nav" aria-label="Navegación principal">
      <a className="brand" href="#inicio"><Image src="/logo-entre-yerbas.jpg" alt="Logo de Entre Yerbas" width={96} height={96} priority /><span>entre__yerbas</span></a>
      <div className="nav-links"><a href="#yerbas">Yerbas</a><a href="#nosotros">Cómo comprar</a><a href="#contacto">Contacto</a></div>
      <div className="nav-actions"><a className="icon-button" href="https://www.instagram.com/entre__yerbas/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={19} /><span>Instagram</span></a><button className="cart-button" onClick={() => setCartOpen(true)}><ShoppingBag size={18} /> Mi pedido <span className="count">{quantity}</span></button></div>
    </nav></header>

    <main>
      <section className="hero" id="inicio"><div className="shell hero-grid">
        <div><span className="eyebrow"><Sparkles size={16} /> Para cada forma de matear</span><h1 className="display">Tu próxima yerba <em>favorita</em> está acá.</h1><p className="hero-copy">Elegí entre distintas marcas, armá tu pedido y coordiná todo por WhatsApp. Simple, rápido y con la calidez de siempre.</p><div className="hero-actions"><a className="primary" href="#yerbas">Ver todas las yerbas <ShoppingBag size={18} /></a><a className="secondary" href="https://wa.me/5492474442232" target="_blank" rel="noreferrer">Consultar por WhatsApp</a></div></div>
        <div className="hero-card"><Image src="/logo-entre-yerbas.jpg" alt="Mate, termo y paquete de Entre Yerbas" width={630} height={739} priority /><div className="hero-note"><span>Pedí a tu manera</span>Nosotros lo preparamos 🧉</div></div>
      </div></section>

      <section className="shell catalog" id="yerbas">
        <div className="section-heading"><div><span className="eyebrow">Nuestro catálogo</span><h2 className="display">Encontrá tu yerba</h2></div><p>{products.length} opciones disponibles</p></div>
        <div className="filters"><label className="field"><Search size={19} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por marca, tipo o peso..." aria-label="Buscar yerbas" /></label><select value={brand} onChange={(e) => setBrand(e.target.value)} aria-label="Filtrar por marca">{brands.map((item) => <option key={item}>{item}</option>)}</select></div>
        <div className="product-grid">{products.map((product) => <article className="product-card" key={product.id}>
          {product.image_url ? <div className="product-art" style={{ background: product.accent }}><Image src={product.image_url} alt={`${product.brand} ${product.name}`} fill sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw" style={{ objectFit: "contain", padding: 20 }} /></div> : <div className="product-art" style={{ background: `linear-gradient(145deg, ${product.accent}, #153d31)` }}><div className="product-art-mark"><span>Yerba mate</span><strong>{product.brand}</strong></div></div>}
          <div className="product-body"><div className="product-meta"><span>{product.weight}</span><span className="stock">{product.stock > 0 ? "Disponible" : "Sin stock"}</span></div><h3>{product.brand} · {product.name}</h3><p className="description">{product.description}</p><div className="price-row"><span className="price">{money.format(product.price)}</span><button className="add-button" onClick={() => add(product)} disabled={product.stock < 1}>Agregar</button></div></div>
        </article>)}{products.length === 0 && <div className="empty">No encontramos yerbas con esos filtros.</div>}</div>
      </section>

      <section className="why" id="nosotros"><div className="shell why-grid"><div><span className="eyebrow pink">Comprar es muy simple</span><h2 className="display">Elegí, pedí y prepará el mate.</h2></div><div className="features"><div className="feature"><Leaf /><strong>Variedad elegida</strong><p>Marcas y estilos para acompañar cada gusto.</p></div><div className="feature"><ShoppingBag /><strong>Armá tu pedido</strong><p>Sumá productos y revisá el total antes de enviarlo.</p></div><div className="feature"><Truck /><strong>Coordinamos</strong><p>Confirmamos stock, pago y entrega por WhatsApp.</p></div></div></div></section>
    </main>

    <footer className="footer" id="contacto"><div className="shell footer-grid"><div><strong>entre__yerbas</strong><div>Todo lo que tu mate estaba buscando.</div></div><div className="socials"><a className="icon-button" href="https://www.instagram.com/entre__yerbas/" target="_blank" rel="noreferrer"><Instagram size={18} /> Instagram</a><Link className="icon-button" href="/admin"><ShieldCheck size={18} /> Administrar</Link></div></div></footer>

    {cartOpen && <><button className="overlay" onClick={() => setCartOpen(false)} aria-label="Cerrar carrito" /><aside className="drawer" aria-label="Mi pedido"><div className="drawer-head"><h2 className="display">Mi pedido</h2><button className="close" onClick={() => setCartOpen(false)} aria-label="Cerrar"><X /></button></div><div className="cart-list">{cart.length === 0 ? <div className="empty">Todavía no agregaste productos.</div> : cart.map(({ product, quantity: itemQuantity }) => <div className="cart-item" key={product.id}><div><strong>{product.brand} {product.name}</strong><p>{product.weight} · {money.format(product.price)}</p></div><div className="qty"><button onClick={() => change(product.id, -1)} aria-label="Quitar uno"><Minus size={15} /></button><strong>{itemQuantity}</strong><button onClick={() => change(product.id, 1)} aria-label="Agregar uno"><Plus size={15} /></button></div></div>)}</div><div className="cart-total"><div className="total-row"><span>Total</span><span>{money.format(total)}</span></div><button className="whatsapp" onClick={sendOrder} disabled={!cart.length}>Enviar pedido por WhatsApp</button></div></aside></>}
  </>;
}
