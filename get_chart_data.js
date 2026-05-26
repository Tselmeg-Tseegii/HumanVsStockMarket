import fs from 'fs/promises'
import path from 'path'
import {
    fileURLToPath
} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dataAPIUrl = 'https://api.twelvedata.com/time_series?symbol=XAU/USD&start_date=2026-3-1&end_date=2026-3-9&interval=15min&apikey='
const symbol = 'XAU/USD'
const startingDate = '2026-3-1'
const endingDate = '2026-3-9'
const interval = '15min'
const apiKey = process.env.TWELVEDATA_MY_API_KEY

const dataAPIUrl = `https://api.twelvedata.com/time_series?
                    symbol=${symbol}&
                    start_date=${startingDate}&
                    end_date=${endingDate}&
                    interval=${interval}&
                    apikey=${apiKey}`

async function getDataFromAPIAndSetFile() {
    const response = await fetch(dataAPIUrl)

    const candleData = await response.json()

    await fs.writeFile(path.join(__dirname, 'website', 'chart_data.json'), JSON.stringify(candleData, null, 2))
}

getDataFromAPIAndSetFile()



