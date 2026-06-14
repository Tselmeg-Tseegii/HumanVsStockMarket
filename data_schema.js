import { z } from 'zod'

export const surveyDataSchema = z.object({
    degree: z.string()
             .trim()
             .max(100, "Degree name too long")
             .regex(/^[a-zA-Z0-9\s.,'-]+$/, "Invalid characters in degree field"),
    yearOfStudy: z.coerce.number().int().min(1).max(5),
    bettingExperience: z.coerce.number().int().min(0).max(5),
    tradingExperience: z.coerce.number().int().min(0).max(4),
    familiarityScore: z.coerce.number().int().min(1).max(10),
    maxAcceptedLoss: z.coerce.number().int().min(0).max(1000),
    riskyInvestmentAmount: z.coerce.number().int().min(0).max(1000)
})


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