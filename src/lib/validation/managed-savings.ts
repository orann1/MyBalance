import { z } from "zod";

const MANAGED_SAVINGS_TYPES = [
  "hishtalmut",
  "gemel",
  "hashkaa",
  "savings",
  "other",
] as const;

const OWNER_LABELS = [
  "self",
  "spouse",
  "child",
  "shared",
  "family",
  "other",
] as const;

// Form/UI schema: validates human-readable values (ILS amounts, percent fees).
// Server actions convert to minor units and bps before persisting.
const baseFields = {
  name: z.string().min(1).max(200),
  type: z.enum(MANAGED_SAVINGS_TYPES),
  owner: z.enum(OWNER_LABELS),
  // Balances: ILS major units. Upper bounds guard against obviously invalid input.
  currentBalance: z.number().min(0).max(50_000_000),
  monthlyContribution: z.number().min(0).max(500_000),
  // Fees: 0–5% range. Phase 2B only supports ILS; currency is enforced server-side.
  accumulationFeePercent: z.number().min(0).max(5),
  depositFeePercent: z.number().min(0).max(5),
  managingCompany: z.string().max(200).optional(),
  trackName: z.string().max(200).optional(),
  officialFundId: z.string().max(50).optional(),
  valuationDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid date",
    }),
  notes: z.string().max(500).optional(),
};

export const CreateManagedSavingsSchema = z.object({
  ...baseFields,
  // Optional initial public fund link, selected by the user in the Add
  // modal's PublicFundMatchModal (select-only mode) before saving. Verified
  // server-side (existence + GemelNet source) in createManagedSavingsHolding.
  // Update/edit never touches publicFundId — link/unlink stays a dedicated
  // action.
  publicFundId: z.string().min(1).optional(),
});

export const UpdateManagedSavingsSchema = z.object({
  id: z.string().min(1),
  ...baseFields,
});

export const ArchiveManagedSavingsSchema = z.object({
  id: z.string().min(1),
});

// Reorder: client submits the full set of currently visible (active) holding
// ids in the user's desired display order. Duplicates are rejected here;
// ownership/archived/missing-id checks happen in the server action itself.
export const ReorderManagedSavingsSchema = z.object({
  orderedIds: z
    .array(z.string().min(1))
    .min(1)
    .refine((ids) => new Set(ids).size === ids.length, {
      message: "Duplicate ids are not allowed",
    }),
});

export type CreateManagedSavingsInput = z.infer<
  typeof CreateManagedSavingsSchema
>;
export type UpdateManagedSavingsInput = z.infer<
  typeof UpdateManagedSavingsSchema
>;
export type ArchiveManagedSavingsInput = z.infer<
  typeof ArchiveManagedSavingsSchema
>;
export type ReorderManagedSavingsInput = z.infer<
  typeof ReorderManagedSavingsSchema
>;
