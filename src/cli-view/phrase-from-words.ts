import * as inquirer from 'inquirer'
import { config } from '../config/config'
import { FrazeItPhrasesService } from '../phrases/fraze-it'
import { YandexTranslateService } from '../words-translator/yandex-translate'
import { TranslationResult, Translator } from '../words-translator/translator'
import { Phrase, PhraseSupplier } from '../phrases/phrase-supplier'

interface PhraseAnswer {
    phrase: string
}

const usage: string =
    `    usage:          "npm run cli -- phrase-from-words --text 'some text'"

    args:
        "-h":                   show usage info
        "--text <<string>>":    text to translate
`

export class PhraseFromWords {

    private phraseSupplier: PhraseSupplier
    private translator: Translator

    main = async (argv: any): Promise<void> => {
        if (argv.h) {
            console.log(usage)
            return process.exit(0)
        }

        await config.load()
        this.phraseSupplier = new FrazeItPhrasesService(config.frazeItApiKey)
        this.translator = new YandexTranslateService(config.yandexApiKey)

        console.log('phrase from text: ', argv.text)

        const phrases: Phrase[] = await this.phraseSupplier.getPhrases(argv.text)

        const phraseAnswer: PhraseAnswer = await inquirer.prompt<PhraseAnswer>({
            type: 'rawlist',
            name: 'phrase',
            message: 'Choose phrase to learn',
            choices: phrases.map(p => `${p.phrase} (${p.src})`)
        })

        const translation: TranslationResult = await this.translator.enToRus(phraseAnswer.phrase)

        console.log(`
(!) ${translation.legalInfo.text}
(!) see ${translation.legalInfo.link}

${phraseAnswer.phrase}
${translation.results.join(', ')}`)
    }
}
