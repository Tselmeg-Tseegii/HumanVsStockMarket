import { z } from 'zod'

export const tradeHistoryItemSchema = z.object({
    type: z.string().trim().min(1).max(10), 
    outcome: z.number(), 
    startTime: z.number().int().positive(), 
    endTime: z.number().int().positive()
})

export const tradeHistoryDataSchema = z.object({
    maxOutcome: z.number(),
    minOutcome: z.number(),
    profit: z.number(),
    
    history: z.array(tradeHistoryItemSchema).max(500, "Trade history exceeds maximum allowed entries") 
})

export const saveDataPayloadSchema = z.object({
    tradeHistoryData: tradeHistoryDataSchema,
    chartDataId: chartDataIdSchema
})

export const profitParamSchema = z.string().regex(/^-?\d+(\.\d+)?$/, "Must be a valid number")

export const histogramBinSchema = z.object({
    binIndex: z.coerce.number().int(), 
    
    binStart: z.coerce.number(), 
    binEnd: z.coerce.number(),
    
    count: z.coerce.number().int().nonnegative() 
})

export const histogramDataSchema = z.array(histogramBinSchema)

export const globalStatsSchema = z.object({
    maxOutcome: z.coerce.number(),
    minOutcome: z.coerce.number(),

    totalEntries: z.coerce.number().int().nonnegative(),
    
    profitRank: z.coerce.number().int()
})

export const candleStickSchema = z.object({
    time: z.coerce.number().int().positive(),
    
    open: z.coerce.number(),
    high: z.coerce.number(),
    low: z.coerce.number(),
    close: z.coerce.number()
});

export const chartDataIdSchema = z.coerce.number()

export const chartDataSchema = z.object({
    id: chartDataIdSchema,
    values: z.array(candleStickSchema)
})