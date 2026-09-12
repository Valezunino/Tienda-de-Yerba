"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email: String(form.get("email")), password: String(form.get("password")) });
      if (authError) throw authError;
      router.replace("/admin"); router.refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "No pudimos iniciar sesión."); }
    finally { setLoading(false); }
  }
  return <main className="login-page"><div className="login-brand"><Image src="/logo-entre-yerbas.jpg" alt="Entre Yerbas" width={630} height={739} priority /></div><div className="login-panel"><form className="login-form" onSubmit={login}><Link className="back-link" href="/"><ArrowLeft size={17} /> Volver a la tienda</Link><span className="eyebrow"><LockKeyhole size={16} /> Acceso privado</span><h1 className="display">Panel de administración</h1><p>Ingresá con la cuenta autorizada para gestionar el catálogo.</p>{error && <div className="notice">{error}</div>}<div className="form-field"><label htmlFor="email">Correo electrónico</label><input id="email" name="email" type="email" autoComplete="email" required /></div><div className="form-field"><label htmlFor="password">Contraseña</label><input id="password" name="password" type="password" autoComplete="current-password" required /></div><button className="primary" disabled={loading}>{loading ? "Ingresando..." : "Ingresar"}</button></form></div></main>;
}
