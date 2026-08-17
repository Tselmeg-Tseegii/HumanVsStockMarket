import express, { raw } from 'express'
import path from 'path'
import pg, { Pool } from 'pg'
import { z } from 'zod'

import {
    fileURLToPath
} from 'url'
import { chartDataSchema, profitParamSchema, saveDataPayloadSchema } from './data_schema.js'


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

app.get('/currentChartId', async (req, res) => {
    try {
        const query = `
        SELECT data_id FROM chart_data ORDER BY data_id DESC LIMIT 1
        `;
        
        const result = await dbPool.query(query);

        res.status(200).json(result.rows[0].data_id);
    } catch (err) {
        console.error("currentChartId:", err);
        res.status(500).json({ error: "error" });
    }
})

app.get('/currentChartData', async (req, res) => {
    try {
        const dataType = req.query.dataType
        const values = []
        if (dataType) {
            if (dataType === 'tutorial') {
                values.push('tutorial')
            } else if (dataType === 'game'){
                values.push('currentReal')
            } else {
                throw Error('invalid input')
            }
        }

        const query = `
        SELECT chartData->$1 AS currentChartData
        FROM chart_data_json
        WHERE id = 1
        `
        
        const result = await dbPool.query(query, values);

        console.log(result.rows[0].currentChartData)

        chartDataSchema.parse(result.rows[0].currentChartData)

        res.status(200).json(result.rows[0].currentChartData);
    } catch (err) {
        console.error("currentChartId:", err);
        res.status(500).json({ error: "error" });
    }
})

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

app.get('/createDailyChart', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        //get the most recent chart data
        const latestQuery = `SELECT date_start, date_end FROM chart_data ORDER BY data_id DESC LIMIT 1`;
        const latestResult = await dbPool.query(latestQuery);
        
        if (latestResult.rows.length === 0) {
            throw new Error("No existing chart data found in database");
        }

        const lastDateEnd = new Date(latestResult.rows[0].date_end);

        //calculate the new start date
        //its lastDateEnd's day + 1 day and set to 00:00:00 time
        let newDateStart = new Date(lastDateEnd);
        newDateStart.setUTCDate(newDateStart.getUTCDate() + 1);
        newDateStart.setUTCHours(0, 0, 0, 0);

        //the starting date has to start on a weekday to avoid weekends
        const dayOfWeek = newDateStart.getUTCDay();
        if (dayOfWeek === 6) { 
            //if saturday, add 2 days to make it monday
            newDateStart.setUTCDate(newDateStart.getUTCDate() + 2);
        } else if (dayOfWeek === 0) { 
            //if sunday, add 1 day to make it monday
            newDateStart.setUTCDate(newDateStart.getUTCDate() + 1);
        }

        //the new date end is just the date start plus one day
        let newDateEnd = new Date(newDateStart);
        newDateEnd.setUTCHours(23, 0, 0, 0);

        //get the data from the twelve data api
        const newChartData = await getChartDataFromTwelveData(newDateStart, newDateEnd);

        //update the database
        if (newChartData) {
            const client = await dbPool.connect();
            
            try {
                await client.query('BEGIN');

                const updateJsonQuery = `
                    UPDATE chart_data_json 
                    SET chartData = jsonb_set(chartData::jsonb, '{currentReal}', $1::jsonb)
                    WHERE id = 1
                `;
                await client.query(updateJsonQuery, [JSON.stringify(newChartData)]);

                const insertDatesQuery = `
                    INSERT INTO chart_data (date_start, date_end, symbol) 
                    VALUES ($1, $2, $3)
                `;
                await client.query(insertDatesQuery, [newDateStart, newDateEnd, 'XAU/USD']);

                await client.query('COMMIT');
            } catch (dbError) {
                await client.query('ROLLBACK'); 
                throw dbError; 
            } finally {
                client.release();
            }
        } else {
            console.log("No data returned from getChartDataFromTwelveData");
        }
    
        res.status(200).json({ message: 'Daily chart update complete' });
        
    } catch (err) {
        console.error("createDailyChart error:", err);
        res.status(500).json({ error: "Failed to get new chart" });
    }
})

async function getChartDataFromTwelveData(startDate, endDate) {
    const symbol = 'XAU/USD'
    const timezone = 'UTC'
    const startingDate = startDate.toISOString().split('.')[0]
    const endingDate = endDate.toISOString().split('.')[0]
    
    const interval = '5min'
    const order = 'asc'
    const apiKey = process.env.TWELVEDATA_MY_API_KEY
    
    const dataAPIUrl = [`https://api.twelvedata.com/time_series?`,
                        `symbol=${symbol}&`,
                        `timezone=${timezone}&`,
                        `start_date=${startingDate}&`,
                        `end_date=${endingDate}&`,
                        `interval=${interval}&`,
                        `order=${order}&`,
                        `apikey=${apiKey}`].join('')
    
    const response = await fetch(dataAPIUrl)

    if (response.status !== 200) {
        return null
    }

    const candleData = await response.json()

    if (candleData.status === 'error' || !candleData.values) {
        console.error("TwelveData API Error:", candleData.message || "No values returned");
        return null;
    }
    
    const formattedCandleData = candleData['values'].map(candle => {

        const {datetime, open, high, low, close} = candle

        const dateObject = new Date(datetime)
        const epochSec = Math.floor(dateObject.getTime() / 1000)

        return {
            time: epochSec,
            open: Number(open),
            high: Number(high),
            low: Number(low),
            close: Number(close)
        }
    })
    
    const finalCandleData = {
        values: formattedCandleData
    }

    return finalCandleData
}

export default app
