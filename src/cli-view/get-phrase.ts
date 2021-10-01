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

    console.log(`${result.map(r => `${r.phrase} (${r.src})`).join('\n')}`)
}

export async function getPhraseFr(argv: any): Promise<void> {
    if (argv.h) {
        console.log(usage)
        return process.exit(0)
    }

    await config.load()
    const result: Phrase[] = await new FrazeItPhrasesService(config.frazeItApiKey)
        .getPhrasesFr(frCharsToAscii(argv.text))

    console.log(`${result.map(r => `${unicodeToChar(r.phrase)} (${unicodeToChar(r.src)})`).join('\n')}`)
}

function unicodeToChar(text: string): string {
    return text.replace(/\\u[\dA-F]{4}/gi,
        function (match) {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
}

function frCharsToAscii(text: string): string {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}
