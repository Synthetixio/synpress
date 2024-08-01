import { z } from 'zod'

export const NetworkValidation = z.object({
  name: z.string(),
  rpcUrl: z.string(),
  chainId: z.number(),
  symbol: z.string(),
  blockExplorerUrl: z.string().optional()
})

export type Network = z.infer<typeof NetworkValidation>
