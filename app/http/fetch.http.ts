import { cookies } from "next/headers";

const serverFetch = async (url: string, options: RequestInit = {}) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  const res = await fetch(`${process.env.API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}; refresh_token=${refreshToken}`,
      ...options.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
};

export default serverFetch;