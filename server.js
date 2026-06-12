import express from 'express'
import path from 'path'
import pg, { Pool } from 'pg'
import cors from 'cors'

import {
    fileURLToPath
} from 'url'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

const PORT = process.env.PORT || 5050

const dbPool = new Pool({
  connectionString: process.env.HUMANS_VS_MARKETS_NEON_DB_CONN_STR,
  ssl: {
    rejectUnauthorized: false, 
  },
})

app.use(cors())

app.use(express.json())

app.use(express.static(path.join(__dirname, 'website')))

if (process.argv[1] === __filename) {
    app.listen(PORT, () => {
        console.log(`Port is ${PORT}`)
    })
}

app.post('/saveData', async (req, res) => {
    let {surveyData, tradeHistoryData} = req.body

    const query = `
    INSERT INTO user_trading_profiles (
        degree, year_of_study, betting_experience, trading_experience, 
        familiarity_score, max_accepted_loss, risky_investment_amount,
        max_outcome, min_outcome, profit, num_entries, trade_history
    ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
    ) RETURNING profile_id;
    `

    const values = [
        surveyData.degree,
        parseInt(surveyData.yearOfStudy),
        parseInt(surveyData.bettingExperience),
        parseInt(surveyData.tradingExperience),
        parseInt(surveyData.familiarityScore),
        parseInt(surveyData.maxAcceptedLoss),
        parseInt(surveyData.riskyInvestmentAmount),
        
        parseFloat(tradeHistoryData.maxOutcome),
        parseFloat(tradeHistoryData.minOutcome),
        parseFloat(tradeHistoryData.profit),
        tradeHistoryData.history.length,         
        JSON.stringify(tradeHistoryData.history)  
    ]

    try {
        const result = await dbPool.query(query, values)

        res.status(200).json({
            message: 'Saved'
        })
    } catch (err) {
        console.log(err)

        res.status(500).json({ 
            error: 'error' 
        });
    }
})

app.get('/globalStats/:profit', async (req, res) => {
    const currProfit = parseFloat(req.params.profit)

    if (isNaN(currProfit)) {
        return res.status(400).json({ error: 'error' })
    }

    const query = `
        SELECT 
            MAX(max_outcome) AS max_max_outcome,
            MIN(min_outcome) AS min_min_outcome,
            COUNT(*) AS total_entries,
            (SELECT COUNT(*) + 1 FROM user_trading_profiles WHERE profit > $1) AS profit_rank
        FROM user_trading_profiles;
    `

    try {
        const result = await dbPool.query(query, [currProfit]);

        const stats = result.rows[0];

        res.status(200).json({
            maxOutcome: parseFloat(stats.max_max_outcome) || 0,
            minOutcome: parseFloat(stats.min_min_outcome) || 0,
            totalEntries: parseInt(stats.total_entries, 10) || 0,
            profitRank: parseInt(stats.profit_rank, 10) || 1
        });

    } catch (error) {
        console.error("globalStats:", error);
        res.status(500).json({ error: "error" });
    }
})

export default app
