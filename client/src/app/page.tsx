"use client";
import { apiPost } from "@/helpers/axios/config";
import socket from "@/helpers/socket";
import { User } from "@/types";
import { useEffect, useState } from "react";

interface ISignInResponse {
  token: string;
  data: User;
}

export default function Home() {
  return <div></div>;
}
