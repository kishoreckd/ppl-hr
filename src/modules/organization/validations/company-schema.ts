import { z } from 'zod'

export const companySchema = z.object({
  companyName: z.string().trim().min(2, 'Enter the company name.'),
  employeeBand: z.string().min(1, 'Select the expected company size.'),
  headName: z.string().trim().min(2, 'Add the first company head.'),
  location: z.string().trim().min(2, 'Add the primary location.'),
})

export type CompanySchemaType = z.infer<typeof companySchema>
