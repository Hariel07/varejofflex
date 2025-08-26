// Script para testar validação de cupom
const testCoupon = async () => {
  try {
    const response = await fetch("https://varejofflex.vercel.app/api/coupons/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: "DESCONTOTOTAL123",
        category: "subscription",
        subscriptionPlan: "pro", // ou "basic", "ultra"
        subscriptionType: "monthly",
        userEmail: "test@example.com"
      }),
    });

    const data = await response.json();
    console.log("Resposta da API:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Erro:", error);
  }
};

testCoupon();