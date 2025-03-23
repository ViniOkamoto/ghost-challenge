"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/checkout");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecionando para o checkout...</p>
    </div>
  );
}
