import { z } from 'zod'

export const correctionSchema = z.object({
  note: z.string().trim().min(6, 'Add a correction note.'),
})

export const regularizationRequestSchema = z.object({
  emergencyContact: z.string().trim().min(8, 'Add an emergency contact.'),
  fromDate: z.string().min(1, 'Select a from date.'),
  toDate: z.string().min(1, 'Select a to date.'),
  from: z.string().trim().min(3, 'Enter the corrected from time.'),
  reason: z.string().trim().min(10, 'Add a short reason for regularization.'),
  requestTitle: z.string().trim().min(3, 'Enter a request title.'),
  to: z.string().trim().min(3, 'Enter the corrected to time.'),
})

export type RegularizationRequestSchemaType = z.infer<typeof regularizationRequestSchema>
