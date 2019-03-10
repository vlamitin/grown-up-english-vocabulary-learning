import { isNil } from 'lodash'
import { config } from '../config/config'
import { FrazeItPhrasesService } from '../phrases/fraze-it'
import { Phrase } from '../phrases/phrase-supplier'

const usage: string =
    `usage:              "npm run cli -- get-phrase ...args"
    example:            "npm run cli -- get-phrase --text='power plant'" 
    
    args:
        "-h":                   show usage info
        "--text <<string>>":    text to search usages
`

export async function getPhrase(argv: any): Promise<void> {
    if (argv.h) {
        console.log(usage)
        return process.exit(0)
    }

    await config.load()
    const result: Phrase[] = await new FrazeItPhrasesService(config.frazeItApiKey)
        .getPhrases(argv.text)

    console.log(`
        query: ${argv.text}
        phrases: 
            ${result.map(r => `${r.src}: ${r.phrase}`).join('\n            ')}
    `)
}
