import { z } from 'zod'

export const GasSettingValidation = z.union([
  z.literal('Slow'),
  z.literal('Fast'),
  z.literal('Average'),
  z
    .object({
      maxBaseFee: z.number(),
      priorityFee: z.number(),
      // TODO: Add gasLimit range validation.
      gasLimit: z.number().optional()
    })
    .superRefine(({ maxBaseFee, priorityFee }, ctx) => {
      if (priorityFee > maxBaseFee) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Max base fee cannot be lower than priority fee',
          path: ['Phantom', 'confirmTransaction', 'gasSetting', 'maxBaseFee']
        })
      }
    })
])

export type GasSettings = z.input<typeof GasSettingValidation>
