import { Suspense } from "react";
import AdminPageClient from "@/components/admin/AdminPageClient";

interface AdminPageProps {
  params: { slug: string };
}

export default function AdminPage({ params }: AdminPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
          <p className="text-white/30 text-sm">Cargando...</p>
        </div>
      }
    >
      <AdminPageClient slug={params.slug} />
    </Suspense>
  );
}
