import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY) {
      return NextResponse.json({
        loaded: false,
        error: "Stripe secret key not defined",
      });
    }

    return NextResponse.json({
      loaded: true,
      secretKey: process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY,
    });
  } catch (error) {
    return NextResponse.json(
      { loaded: false, error: "Failed to load stripe" },
      { status: 500 }
    );
  }
}
