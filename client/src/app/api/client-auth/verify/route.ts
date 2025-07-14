// app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "@hrrtickets/common";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!process.env.NEXT_PUBLIC_JWT_KEY) {
    return NextResponse.json(
      { valid: false, error: "JWT KEY missing" },
      { status: 401 }
    );
  }

  if (!token) {
    return NextResponse.json(
      { valid: false, error: "Token missing" },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.NEXT_PUBLIC_JWT_KEY
    ) as CustomJwtPayload;

    return NextResponse.json({
      valid: true,
      user: { id: decoded.id, role: decoded.role, exp: decoded.exp },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        valid: false,
        error: "Invalid token",
        authHeader,
        jwtError: err.message,
      },
      { status: 401 }
    );
  }
}
