"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [ready, setReady] = useState(isLoginPage);

  useEffect(() => {
    if (isLoginPage) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace("/admin/login");
      else setReady(true);
    });
  }, [isLoginPage, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FB]">
        <Loader2 className="w-8 h-8 text-[#1E40AF] animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
