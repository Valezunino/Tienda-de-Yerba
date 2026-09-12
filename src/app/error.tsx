"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="error-page"><div><span className="eyebrow">Entre Yerbas</span><h1 className="display">El catálogo está descansando un ratito.</h1><p>No pudimos cargar los productos. Volvé a intentarlo en unos segundos.</p><button className="primary" onClick={reset}>Intentar nuevamente</button></div></main>;
}
