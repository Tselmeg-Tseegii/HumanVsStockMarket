import { z } from 'zod'

export const surveyDataSchema = z.object({
    isUniversityStudent: z.boolean(),
    profession: z.string()
             .trim()
             .max(100, "Profession name too long")
             .regex(/^[a-zA-Z0-9\s.,'-]+$|^not applicable$/, "Invalid characters in profession field"),
    degree: z.string()
             .trim()
             .max(100, "Degree name too long")
             .regex(/^[a-zA-Z0-9\s.,'-]+$|^not applicable$/, "Invalid characters in degree field"),
    yearOfStudy: z.union([
             z.coerce.number().int().min(1).max(5), 
             z.literal("not applicable")
    ]),
    bettingExperience: z.coerce.number().int().min(0).max(5),
    tradingExperience: z.coerce.number().int().min(0).max(4),
    familiarityScore: z.coerce.number().int().min(1).max(10),
    maxAcceptedLoss: z.coerce.number().int().min(0).max(10000),
    riskyInvestmentAmount: z.coerce.number().int().min(0).max(10000)
});


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
    surveyData: surveyDataSchema,
    tradeHistoryData: tradeHistoryDataSchema
})

export const profitParamSchema = z.coerce.number()

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

export const candleStickDataArraySchema = z.array(candleStickSchema)