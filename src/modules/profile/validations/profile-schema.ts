import { z } from 'zod'

export const profileContactSchema = z.object({
  address: z.string().trim().min(3, 'Add your address.'),
  email: z.email('Add a valid email address.'),
  phone: z.string().trim().min(8, 'Add a valid phone number.'),
  workLocation: z.string().trim().min(3, 'Add your work location.'),
})

export const profileOverviewSchema = z.object({
  about: z.string().trim().min(10, 'Add a short work summary.'),
  bio: z.string().trim().min(10, 'Add your bio.'),
})

export const profileInterestsSchema = z.object({
  interests: z.string().trim().min(2, 'Add at least one interest.'),
})

export type ProfileContactSchemaType = z.infer<typeof profileContactSchema>
export type ProfileInterestsSchemaType = z.infer<typeof profileInterestsSchema>
export type ProfileOverviewSchemaType = z.infer<typeof profileOverviewSchema>
