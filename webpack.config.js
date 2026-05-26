import path from 'path'
import {
    fileURLToPath
} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
    entry: './website/chart_setup.js',
    output: {
        filename: 'deployment.js',
        path: path.resolve(__dirname, 'website')
    }
}