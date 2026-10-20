// NEXT_PUBLIC_* values must be referenced literally so Next can inline them.
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export const env = {
  apiUrl,
  // Socket.IO lives on the server root: the API url without the trailing /api
  socketUrl: (process.env.NEXT_PUBLIC_SOCKET_URL),
  demoToken: process.env.NEXT_PUBLIC_DEMO_TOKEN ?? "",
  useMock: process.env.NEXT_PUBLIC_USE_MOCK === "true",
} as const;
