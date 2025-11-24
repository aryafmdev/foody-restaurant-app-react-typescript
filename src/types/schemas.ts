import { z } from 'zod'

export const MenuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  imageUrl: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
})

export type MenuItem = z.infer<typeof MenuItemSchema>
