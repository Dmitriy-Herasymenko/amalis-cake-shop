// app/api/pay/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

const PUBLIC_KEY = process.env.LIQPAY_PUBLIC_KEY!;
const PRIVATE_KEY = process.env.LIQPAY_PRIVATE_KEY!;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;

export async function POST(req: Request) {

  const { amount, order_id, description } = await req.json();

  const data = {
    public_key: PUBLIC_KEY,
    version: "3",
    action: "pay",
    amount,
    currency: "UAH",
    description,
    order_id,
    sandbox: 1,
    server_url: `${SITE_URL}/api/pay/callback`,
  };

  const dataStr = Buffer.from(JSON.stringify(data)).toString("base64");
  const signature = crypto
    .createHash("sha1")
    .update(PRIVATE_KEY + dataStr + PRIVATE_KEY)
    .digest("base64");

  return NextResponse.json({ data: dataStr, signature });
}
