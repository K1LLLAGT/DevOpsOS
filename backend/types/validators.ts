import { z } from "zod";

export const ZTerminalStart = z.object({
  type: z.literal("terminal:start"),
  id: z.string(),
  cols: z.number(),
  rows: z.number()
});

export const ZTerminalInput = z.object({
  type: z.literal("terminal:input"),
  id: z.string(),
  data: z.string()
});

export const ZTerminalResize = z.object({
  type: z.literal("terminal:resize"),
  id: z.string(),
  cols: z.number(),
  rows: z.number()
});

export const ZTerminalKill = z.object({
  type: z.literal("terminal:kill"),
  id: z.string()
});

// ...repeat for all message types...

export const ZFrontendToBackend = z.discriminatedUnion("type", [
  ZTerminalStart,
  ZTerminalInput,
  ZTerminalResize,
  ZTerminalKill,
  // ... all others ...
]);
