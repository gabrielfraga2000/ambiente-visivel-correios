"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    const response = await signIn("credentials", { email, password, redirect: false });

    if (response?.error) {
      setError("Credenciais inválidas.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <div className="card w-full space-y-4">
        <h1 className="text-2xl font-semibold">Acesso ao dashboard</h1>
        <form className="space-y-3" onSubmit={handleLogin}>
          <input type="email" name="email" placeholder="Email" required className="w-full rounded border p-2" />
          <input type="password" name="password" placeholder="Senha" required className="w-full rounded border p-2" />
          <button disabled={loading} className="w-full rounded bg-brand-500 py-2 font-medium text-white">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <p className="text-xs text-slate-500">Caso não tenha usuário, registre via endpoint /api/auth/register.</p>
      </div>
    </main>
  );
}
