import path from 'path'
import {
    fileURLToPath
} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
    entry: {
        tutorial: './app_logic/tutorial.js',
        ending: './app_logic/ending.js',
        game_loop: './app_logic/game_loop.js'
    },
    output: {
        filename: '[name]_deployment.js',
        path: path.resolve(__dirname, 'website')
    }
}