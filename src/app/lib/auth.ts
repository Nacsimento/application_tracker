import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";

export async function auth() {
  return await getServerSession(options);
}