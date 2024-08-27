import { z } from 'zod'

export const GasSettingValidation = z.union([
  z.literal('low'),
  z.literal('market'),
  z.literal('aggressive'),
  z.literal('site'),
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
          path: ['MetaMask', 'confirmTransaction', 'gasSetting', 'maxBaseFee']
        })
      }
    })
])

export type GasSettings = z.input<typeof GasSettingValidation>
