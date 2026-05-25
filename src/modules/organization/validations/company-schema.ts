import { z } from 'zod'

export const companySchema = z.object({
  adminEmployees: z.string().trim().min(2, 'Add at least one admin employee.'),
  companyDomain: z.string().trim().min(2, 'Enter the company domain.'),
  companyName: z.string().trim().min(2, 'Enter the company name.'),
  companyWebsite: z.string().trim().url('Enter a valid company website URL.'),
  email: z.string().trim().email('Enter a valid work email.'),
  employeeBand: z.string().min(1, 'Select the expected company size.'),
  firstName: z.string().trim().min(2, 'Enter the first name.'),
  headName: z.string().trim().min(2, 'Add the first company head.'),
  lastName: z.string().trim().min(2, 'Enter the last name.'),
  location: z.string().trim().min(2, 'Add the primary location.'),
})

export type CompanySchemaType = z.infer<typeof companySchema>
