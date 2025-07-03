"use client";
import { apiPost } from "@/helpers/axios/config";
import { User } from "@/types";

interface ISignInResponse {
  token: string;
  data: User;
}

export default function Home() {
  return (
    <div>
      <div className="text-center">
        <h1>HELLO WORLD</h1>
      </div>
    </div>
  );
}
