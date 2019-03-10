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
    let from: number
    let to: number

    Object.keys(argv).forEach((argKey: string) => {
        switch (argKey) {
            default:
                if (!isNil(argv[argKey])) {
                    console.warn(`Invalid option "${argKey}" given. See "npm run cli -- show-words -h"`)
                    return process.exit(1)
                }
                return
            case 'h':
                console.log(usage)
                return process.exit(0)
            case 'f':
                if (typeof argv.f === 'number' && Math.round(argv.f) === argv.f) {
                    from = argv.f
                } else {
                    console.warn(`Invalid type of "${argKey}" given. See "npm run cli -- show-words -h"`)
                    return process.exit(1)
                }
                break
            case 't':
                if (typeof argv.t === 'number' && Math.round(argv.t) === argv.t) {
                    to = argv.t
                } else {
                    console.warn(`Invalid type of "${argKey}" given. See "npm run cli -- show-words -h"`)
                    return process.exit(1)
                }
                break
        }
    })

    const words: string[] = await getFrequencySortedWords(from, to)

    console.log(words)
}
