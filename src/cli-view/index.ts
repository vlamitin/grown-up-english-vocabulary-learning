#!/usr/bin/env node

import { showWords } from './show-words'
import { translate, translateFr } from './translate-text'
import { getPhrase, getPhraseFr } from './get-phrase'
import { LearnNew } from './learn-new'
import { PhraseFromWords } from './phrase-from-words'

const usage: string =
`    usage:          "npm run cli -- <<command>> ...args"
    args format:    "-a 5" - pass number, "-x" - pass boolean, "--foo=bar" - pass string
    example:        "npm run cli -- show-words -f 100 -t 200" 
    
    commands:
        "help":               show usage info
        "show-words":         show words
        "translate":          translates en text to ru
        "translate-fr":       translates fr text to en
        "get-phrase":         get en phrase with usage of given text
        "get-phrase-fr":      get fr phrase with usage of given text
        "phrase-from-words":  get phrase with translation from given text
        "learn-new":          learn new words
`

function parseCliArgs(): Promise<void> | void {
    const argv = require('minimist')(process.argv.slice(2))

    if (!argv._ || argv._.length === 0) {
        console.warn('No command specified. See "npm run cli -- help"')
        return process.exit(1)
    }

    if (argv._.length > 1) {
        console.warn('Only one command allowed. See "npm run cli -- help"')
        return process.exit(1)
    }

    switch (argv._[0]) {
        default:
            console.warn(`Unknown command "${argv._[0]}". See "npm run cli -- help"`)
            return process.exit(1)
        case 'help':
            console.log(usage)
            return process.exit(0)
        case 'show-words':
            return showWords({
                ...argv,
                _: undefined
            })
        case 'translate':
            return translate({
                ...argv,
                _: undefined
            })
        case 'translate-fr':
            return translateFr({
                ...argv,
                _: undefined
            })
        case 'get-phrase':
            return getPhrase({
                ...argv,
                _: undefined
            })
        case 'get-phrase-fr':
            return getPhraseFr({
                ...argv,
                _: undefined
            })
        case 'phrase-from-words':
            return new PhraseFromWords().main({
                ...argv,
                _: undefined
            })
        case 'learn-new':
            return new LearnNew().start()
    }
}

parseCliArgs()
