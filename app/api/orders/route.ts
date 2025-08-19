import { prisma } from "@/app/lib/prisma";


async function test() {
const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });

  console.log(orders);
}

test();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received order body:", body);

    const { name, phone, address, callBack, payment, items, totalPrice } = body;

    // Приводимо callBack до boolean
    const callBackBool = callBack === "on" || callBack === true;

    const order = await prisma.order.create({
      data: {
        name,
        phone,
        address,
        callBack: callBackBool,
        payment,
        items, // має бути валідний JSON
        totalPrice,
        status: "NEW",
        isNew: true,
      },
    });

    console.log("Order created:", order);
    return new Response(JSON.stringify(order), { status: 200 });
  } catch (e: any) {
    console.error("POST /api/orders error:", e);
    return new Response(e.message || "Error creating order", { status: 500 });
  }
}


export async function GET() {
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
    return new Response(JSON.stringify(orders), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("GET /api/orders error:", e); // ← лог на сервер
    return new Response(JSON.stringify({ error: e.message || "Error fetching orders" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


export async function PUT(req: Request) {
  try {
    const { id, status, comment, paid } = await req.json();
    if (!id) return new Response("ID required", { status: 400 });

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status, comment, paid, isNew: false },
    });

    return new Response(JSON.stringify(updatedOrder), { status: 200 });
  } catch (e: any) {
    return new Response(e.message || "Error updating order", { status: 500 });
  }
}
