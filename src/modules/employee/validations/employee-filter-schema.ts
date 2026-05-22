import { z } from 'zod'

export const employeeFilterSchema = z.object({ period: z.string().optional() })
