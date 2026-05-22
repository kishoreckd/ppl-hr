import { z } from 'zod'

export const calendarFilterSchema = z.object({ month: z.string().optional() })
