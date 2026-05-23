import { z } from 'zod'

export const holidaySchema = z.object({
  date: z.string().min(1, 'Select a date.'),
  location: z.string().trim().min(2, 'Add a location.'),
  name: z.string().trim().min(2, 'Add a holiday name.'),
})

export const leaveRequestSchema = z.object({
  emergencyContact: z.string().trim().min(8, 'Add an emergency contact.'),
  fromDate: z.string().min(1, 'Select a start date.'),
  fromTime: z.string().min(1, 'Select a start time.'),
  leaveType: z.string().min(1, 'Select leave type.'),
  reason: z.string().trim().min(10, 'Add a reason for leave.'),
  toDate: z.string().min(1, 'Select an end date.'),
  toTime: z.string().min(1, 'Select an end time.'),
})

export type HolidaySchemaType = z.infer<typeof holidaySchema>
export type LeaveRequestSchemaType = z.infer<typeof leaveRequestSchema>
