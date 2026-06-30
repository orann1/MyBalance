import { z } from "zod";

const PUBLIC_DATA_SOURCES = ["gemelnet", "pensionnet"] as const;
const PUBLIC_FUND_PRODUCT_TYPES = ["hishtalmut", "gemel", "hashkaa", "pension", "unknown"] as const;

export const PublicFundSearchSchema = z.object({
  query: z.string().max(200).optional(),
  source: z.enum(PUBLIC_DATA_SOURCES).optional(),
  productType: z.enum(PUBLIC_FUND_PRODUCT_TYPES).optional(),
  managingCompany: z.string().max(200).optional(),
  fundId: z.union([z.string().max(50), z.number()]).optional(),
  limit: z.number().int().positive().max(20).optional(),
});

export type PublicFundSearchValidatedInput = z.infer<typeof PublicFundSearchSchema>;
