import { z } from 'zod'

export const approvalSchema = z.object({ note: z.string().optional() })
