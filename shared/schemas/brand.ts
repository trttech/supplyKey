import { z } from "zod"

const hexColor = z.string().regex(/^#[0-9a-f]{6}$/i, "Color must be a 6-digit hex value (e.g. #003f63)")

export const updateBrandSchema = z.object({
	orgName: z.string().min(1, "Organization name is required").max(80).optional(),
	tagline: z.string().min(1, "Tagline is required").max(120).optional(),
	logoDataUrl: z.string().max(500_000).nullable().optional(),
	primaryColor: hexColor.optional(),
	sidebarColor: hexColor.optional(),
	accentColor: hexColor.optional(),
}).refine(
	v => Object.values(v).some(field => field !== undefined),
	{ message: "At least one field is required" },
)

export type UpdateBrandInput = z.infer<typeof updateBrandSchema>
