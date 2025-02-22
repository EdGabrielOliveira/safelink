"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para a página de vídeo
    router.push("/video");
  }, [router]);

  return null;
}
