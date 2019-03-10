import { getFrequencySortedWords } from '../words-supplier'
import { isNil } from 'lodash'

const usage: string =
    `    usage:          "npm run cli -- show-words ...args"
    example:            "npm run cli -- show-words -f 100 -t 200" 
    
    args:
        "-h":               show usage info
        "-f <<number>>":    show words from
        "-t <<number>>":    show words to
`

export async function showWords(argv: any): Promise<void> {
    if (argv.h) {
        console.log(usage)
        return process.exit(0)
    }

    const words: string[] = await getFrequencySortedWords(argv.f, argv.t)

    console.log(words)
}
