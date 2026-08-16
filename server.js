import express, { raw } from 'express'
import path from 'path'
import pg, { Pool } from 'pg'
import { z } from 'zod'

import {
    fileURLToPath
} from 'url'
import { profitParamSchema, saveDataPayloadSchema } from './data_schema.js'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

const PORT = process.env.PORT || 5050

const dbPool = new Pool({
  connectionString: process.env.HUMANS_VS_MARKETS_NEON_DB_CONN_STR,
})

app.use(express.json({limit: '100kb'}))

app.use(express.static(path.join(__dirname, 'website')))

if (process.argv[1] === __filename) {
    app.listen(PORT, () => {
        console.log(`Port is ${PORT}`)
    })
}

app.post('/saveData', async (req, res) => {
    try {
        const validatedData = saveDataPayloadSchema.parse(req.body);

        const { tradeHistoryData } = validatedData;

        const query = `
        INSERT INTO user_trading_profiles (
            data_id, max_outcome, min_outcome, profit, num_entries, trade_history
        ) VALUES (
            (SELECT data_id FROM chart_data ORDER BY data_id DESC LIMIT 1),
            $1, $2, $3, $4, $5
        ) RETURNING data_id;
        `;

        const values = [
            parseFloat(tradeHistoryData.maxOutcome), 
            parseFloat(tradeHistoryData.minOutcome),  
            parseFloat(tradeHistoryData.profit), 
            tradeHistoryData.history.length, 
            JSON.stringify(tradeHistoryData.history) 
        ];
        
        const result = await dbPool.query(query, values);

        res.status(200).json({
            message: 'Saved'
        })
    } catch (err) {
        console.log(err)

        if (err instanceof z.ZodError) {
            return res.status(400).json({ 
                error: 'Invalid input data', 
                details: err.errors 
            })
        }

        res.status(500).json({ 
            error: 'error' 
        });
    }
})

app.get('/globalStats', async (req, res) => {
    try {
        const rawProfit = req.query.profit
        let currProfit = null
        if (rawProfit !== undefined && rawProfit !== '') {
            currProfit = profitParamSchema.parse(rawProfit); 
        }

        const query = `
        WITH LatestChart AS (
            SELECT data_id FROM chart_data ORDER BY data_id DESC LIMIT 1
        )
        SELECT 
            MAX(max_outcome) AS max_max_outcome,
            MIN(min_outcome) AS min_min_outcome,
            COUNT(*) AS total_entries,
            CASE 
                WHEN $1::NUMERIC IS NOT NULL THEN (
                    SELECT COUNT(*) + 1 
                    FROM user_trading_profiles 
                    WHERE profit > $1::NUMERIC 
                    AND data_id = (SELECT data_id FROM LatestChart)
                )
                ELSE NULL 
            END AS profit_rank
        FROM user_trading_profiles
        WHERE data_id = (SELECT data_id FROM LatestChart);
        `;
        const result = await dbPool.query(query, [currProfit])

        const stats = result.rows[0]

        res.status(200).json({
            maxOutcome: parseFloat(stats.max_max_outcome) || 0,
            minOutcome: parseFloat(stats.min_min_outcome) || 0,
            totalEntries: parseInt(stats.total_entries, 10) || 0,
            profitRank: stats.profit_rank ? parseInt(stats.profit_rank, 10) : -1
        })

    } catch (error) {
        console.error("globalStats:", error)

        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Invalid profit parameter' })
        }

        res.status(500).json({ error: "error" })
    }
})

app.get('/globalStatsHist', async (req, res) => {
    const query = `
        WITH LatestChart AS (
            SELECT data_id FROM chart_data ORDER BY data_id DESC LIMIT 1
        ),
        stats AS (
            SELECT 
                MIN(profit) AS min_profit, 
                MAX(profit) AS max_profit 
            FROM user_trading_profiles
            WHERE data_id = (SELECT data_id FROM LatestChart)
        )
        SELECT 
            WIDTH_BUCKET(profit, min_profit, max_profit + 0.000001, 10) AS bin_index,
            MIN(profit) AS bin_start,
            MAX(profit) AS bin_end,
            COUNT(*) AS frequency
        FROM user_trading_profiles, stats
        WHERE user_trading_profiles.data_id = (SELECT data_id FROM LatestChart)
        GROUP BY bin_index
        ORDER BY bin_index ASC;
    `

    try {
        const result = await dbPool.query(query);

        const histogramData = result.rows.map(row => ({
            binIndex: parseInt(row.bin_index, 10),
            binStart: parseFloat(row.bin_start),
            binEnd: parseFloat(row.bin_end),
            count: parseInt(row.frequency, 10)
        }));

        res.status(200).json(histogramData);

    } catch (error) {
        console.error("globalStats:", error);
        res.status(500).json({ error: "error" });
    }
})

export default app
