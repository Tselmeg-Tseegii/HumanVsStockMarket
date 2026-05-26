import fs from 'fs/promises'
import path from 'path'
import {
    fileURLToPath
} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dataAPIUrl = ''

async function getDataFromAPIAndSetFile() {
    const response = await fetch(dataAPIUrl)

    const candleData = await response.json()

    await fs.writeFile(path.join(__dirname, 'website', 'chart_data.json'), JSON.stringify(candleData, null, 2))
}

getDataFromAPIAndSetFile()



