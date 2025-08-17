"use client";
import { useEffect } from "react";

export default function BootstrapClient() {
  useEffect(() => {
    // usa a entrada tipada do pacote
    void import("bootstrap");
  }, []);
  return null;
}
