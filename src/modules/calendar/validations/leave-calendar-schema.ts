import { z } from 'zod'

export const holidaySchema = z.object({
  date: z.string().min(1, 'Select a date.'),
  location: z.string().trim().min(2, 'Add a location.'),
  name: z.string().trim().min(2, 'Add a holiday name.'),
})

export const leaveRequestSchema = z
  .object({
    compOffHours: z.string().optional(),
    compOffWorkedDate: z.string().optional(),
    emergencyContact: z.string().trim().min(8, 'Add an emergency contact.'),
    fromDate: z.string().min(1, 'Select a start date.'),
    fromTime: z.string().optional(),
    leaveType: z.string().min(1, 'Select leave type.'),
    reason: z.string().trim().min(10, 'Add a reason for leave.'),
    toDate: z.string().min(1, 'Select an end date.'),
    toTime: z.string().optional(),
  })
  .superRefine((values, context) => {
    if (values.leaveType !== 'Compensatory Off') {
      if (!values.fromTime) {
        context.addIssue({
          code: 'custom',
          message: 'Select a start time.',
          path: ['fromTime'],
        })
      }

      if (!values.toTime) {
        context.addIssue({
          code: 'custom',
          message: 'Select an end time.',
          path: ['toTime'],
        })
      }

      return
    }

    if (!values.compOffWorkedDate) {
      context.addIssue({
        code: 'custom',
        message: 'Select the worked date for comp off.',
        path: ['compOffWorkedDate'],
      })
    }

    if (!values.compOffHours) {
      context.addIssue({
        code: 'custom',
        message: 'Add earned comp off hours.',
        path: ['compOffHours'],
      })
    }
  })

export const leavePolicySchema = z.object({
  annualQuota: z.string().trim().min(1, 'Enter annual quota.'),
  balanceLevel: z.string().trim().min(2, 'Select a balance level.'),
  cashable: z.enum(['Yes', 'No']),
  gender: z.string().trim().min(2, 'Select who can use this leave.'),
  status: z.enum(['Active', 'Inactive']),
  type: z.string().trim().min(2, 'Enter a leave type.'),
})

export type HolidaySchemaType = z.infer<typeof holidaySchema>
export type LeaveRequestSchemaType = z.infer<typeof leaveRequestSchema>
export type LeavePolicySchemaType = z.infer<typeof leavePolicySchema>
