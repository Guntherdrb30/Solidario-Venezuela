"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const consentKey = "solidario_security_consent";

async function recordConsent(consent: "accepted" | "necessary") {
  try {
    await fetch("/api/security/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "consent.updated",
        severity: "info",
        consent,
        path: window.location.pathname,
        message: "User selected privacy and security logging preference.",
      }),
      keepalive: true,
    });
  } catch {
    // Consent must never block the user experience.
  }
}

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(!window.localStorage.getItem(consentKey));
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const savePreference = (value: "accepted" | "necessary") => {
    window.localStorage.setItem(consentKey, value);
    document.cookie = `sv_security_consent=${value}; Max-Age=31536000; Path=/; SameSite=Lax`;
    setVisible(false);
    void recordConsent(value);
  };

  if (!visible) {
    return null;
  }

  return (
    <section className="fixed inset-x-0 bottom-0 z-50 border-t border-[#ddd8c8] bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.12)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-[#16201a]">
            Privacidad, cookies y seguridad
          </p>
          <p className="mt-2 text-sm leading-6 text-[#5d6961]">
            Usamos cookies necesarias y registros tecnicos de seguridad para
            proteger la plataforma. Estos registros pueden incluir IP, navegador,
            ruta visitada y eventos sospechosos. Consulta{" "}
            <Link className="font-semibold text-[#1f7a4d]" href="/cookies">
              Cookies y privacidad
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            className="min-h-11 rounded-md border border-[#bfc7bd] px-5 text-sm font-semibold text-[#25332b] transition hover:border-[#1f7a4d] hover:text-[#1f7a4d]"
            onClick={() => savePreference("necessary")}
            type="button"
          >
            Solo necesarias
          </button>
          <button
            className="min-h-11 rounded-md bg-[#1f7a4d] px-5 text-sm font-semibold text-white transition hover:bg-[#17663f]"
            onClick={() => savePreference("accepted")}
            type="button"
          >
            Aceptar y continuar
          </button>
        </div>
      </div>
    </section>
  );
}
