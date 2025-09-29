// app/api/pay/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  const { data, signature } = await req.json();

  const expectedSignature = Buffer.from(
    crypto
      .createHash("sha1")
      .update(process.env.LIQPAY_PRIVATE_KEY + data + process.env.LIQPAY_PRIVATE_KEY)
      .digest()
  ).toString("base64");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const decoded = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));

  if (["ok", "sandbox"].includes(decoded.status)) {
    await prisma.order.update({
      where: { orderNumber: Number(decoded.order_id) },
      data: { paid: true, payment: "paypass" },
    });
      console.log("✅ Оплата успішна:", decoded.order_id);
  }
      console.log("✅ Оплата успішна:", decoded.order_id);
  return NextResponse.json({ ok: true });
}
