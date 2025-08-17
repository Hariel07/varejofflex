import React from "react";

export default function DemoPage() {
  return (
    <main className="p-0 m-0" style={{ minHeight: "100vh" }}>
      <iframe
        src="/vf-delivery-demo.html"
        title="Demo Delivery — Varejofflex"
        style={{
          display: "block",
          border: 0,
          width: "100%",
          height: "100vh", // ocupa a viewport inteira
        }}
        allow="clipboard-read; clipboard-write"
      />
    </main>
  );
}
