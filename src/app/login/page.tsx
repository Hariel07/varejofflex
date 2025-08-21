// src/app/login/page.tsx
import { Suspense } from "react";
import LoginClient from "./login-client";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginClient />
    </Suspense>
  );
}
