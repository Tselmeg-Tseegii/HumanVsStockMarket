import fs from 'fs/promises'
import path from 'path'
import {
    fileURLToPath
} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const symbol = 'XAU/USD'
const timezone = 'UTC'

//test data range
// const startingDate = '2026-3-1T23:00:00'
// const endingDate = '2026-3-3T8:00:00'

// good tut range
const startingDate = '2026-3-1T23:00:00'
const endingDate = '2026-3-3T00:00:00'

//main data range
// const startingDate = '2026-3-22T23:00:00'
// const endingDate = '2026-3-25T00:00:00'

const interval = '15min'
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

async function getDataFromAPIAndSetFile() {
    const response = await fetch(dataAPIUrl)

    const candleData = await response.json()
    console.log(candleData['values'].length)
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

    // await fs.writeFile(path.join(__dirname, 'website', 'chart_data.json'), JSON.stringify(finalCandleData, null, 2))
    await fs.writeFile(path.join(__dirname, 'website', 'tut_chart_data.json'), JSON.stringify(finalCandleData, null, 2))
}

getDataFromAPIAndSetFile()



