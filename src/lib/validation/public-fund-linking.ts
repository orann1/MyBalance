import { z } from "zod";

export const LinkPublicFundSchema = z.object({
  holdingId: z.string().min(1),
  publicFundId: z.string().min(1),
});

export const UnlinkPublicFundSchema = z.object({
  holdingId: z.string().min(1),
});

export type LinkPublicFundInput = z.infer<typeof LinkPublicFundSchema>;
export type UnlinkPublicFundInput = z.infer<typeof UnlinkPublicFundSchema>;
