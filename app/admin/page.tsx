import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
  if (isAdmin()) redirect("/admin/dashboard");
  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <h1 className="font-serif text-2xl font-bold text-unkhair-dark">
          Login Admin
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Akses panel admin pendaftaran wisuda.
        </p>
        <LoginForm />
        <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          <strong>Default kredensial:</strong> admin / unkhair123
        </div>
      </div>
    </div>
  );
}
