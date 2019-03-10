import * as inquirer from 'inquirer'
import { config } from '../config/config'
import { getFrequencySortedWords } from '../words-supplier'
import { FrazeItPhrasesService } from '../phrases/fraze-it'
import { YandexTranslateService } from '../words-translator/yandex-translate'
import { TranslationResult, Translator } from '../words-translator/translator'
import { Phrase, PhraseSupplier } from '../phrases/phrase-supplier'

interface FromAnswer {
    from: number
}

interface PhraseAnswer {
    phrase: string
}

interface TranslateAnswer {
    word: string
}

interface UserTranslationAnswer {
    translation: string
}

export class LearnNew {

    private currentWordIndex: number = 0
    private words: string[]
    private phraseSupplier: PhraseSupplier
    private translator: Translator

    start = async (): Promise<void> => {
        const fromAnswer: FromAnswer = await inquirer.prompt<FromAnswer>({
            type: 'number',
            name: 'from',
            message: 'Enter number of sorted by freq word to start learning from',
            default: 0
        })

        this.words = await getFrequencySortedWords(fromAnswer.from)

        await config.load()
        this.phraseSupplier = new FrazeItPhrasesService(config.frazeItApiKey)
        this.translator = new YandexTranslateService(config.yandexApiKey)

        this.learnNextWord()
    }

    learnNextWord = async (): Promise<void> => {
        const phrases: Phrase[] = await this.phraseSupplier.getPhrases(this.words[this.currentWordIndex++])

        const phraseAnswer: PhraseAnswer = await inquirer.prompt<PhraseAnswer>({
            type: 'rawlist',
            name: 'phrase',
            message: 'Choose phrase to learn',
            choices: phrases.map(p => `${p.phrase} (${p.src})`)
        })

        const userTranslation: string = await this.getUserTranslationOfPhrase(phraseAnswer.phrase)

        // TODO записывать в resistanse layer и учить следующее слово
        console.log('tr: ', userTranslation)
    }

    getUserTranslationOfPhrase = async (phrase: string): Promise<string> => {
        await this.promptTranslationHelp(phrase)

        const userTranslation: UserTranslationAnswer = await inquirer.prompt<UserTranslationAnswer>({
            type: 'input',
            name: 'translation',
            message: `Enter your russian translation of this phrase: "${phrase}"`,
        })

        return userTranslation.translation
    }

    promptTranslationHelp = async (phrase: string): Promise<void> => {
        const DENY_FROM_TRANSLATION: string = 'Nope! I am good'

        const translate: TranslateAnswer = await inquirer.prompt<TranslateAnswer>({
            type: 'rawlist',
            name: 'word',
            message: 'Do you need to translate any word?',
            choices: [DENY_FROM_TRANSLATION, ...phrase.split(' ')]
        })

        if (translate.word === DENY_FROM_TRANSLATION) {
            return
        }

        const result: TranslationResult = await this.translator.enToRus(translate.word)

        console.log(`
            (!) ${result.legalInfo.text}
            (!) see ${result.legalInfo.link}
            
            en: ${translate.word}
            ru: ${result.results.join(', ')}
        `)

        return this.promptTranslationHelp(phrase)
    }
}
