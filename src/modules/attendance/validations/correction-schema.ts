import { z } from 'zod'

export const correctionSchema = z.object({
  note: z.string().trim().min(6, 'Add a correction note.'),
})
