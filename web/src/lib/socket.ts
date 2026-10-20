import { io } from "socket.io-client";
import { env } from "@/config/env";
import { MockSocket } from "@/lib/mockSocket";

// The small part of a socket we use (real and mock sockets both fit it).
export type ChatSocket = {
  connected: boolean;
  on: (event: string, cb: (...args: any[]) => void) => unknown;
  off: (event: string, cb: (...args: any[]) => void) => unknown;
  emit: (event: string, ...args: any[]) => unknown;
  disconnect: () => unknown;
};

export function createSocket(token: string | null): ChatSocket {
  if (env.useMock) return new MockSocket();

  return io(env.socketUrl, { auth: { token }, transports: ["websocket"] }) as unknown as ChatSocket;
}
