import * as inquirer from 'inquirer'
import { config } from '../config/config'
import { getFrequencySortedWords } from '../words-supplier'
import { FrazeItPhrasesService } from '../phrases/fraze-it'
import { YandexTranslateService } from '../words-translator/yandex-translate'
import { TranslationResult, Translator } from '../words-translator/translator'
import { Phrase, PhraseSupplier } from '../phrases/phrase-supplier'
import { DictionaryDbConnector } from '../persistance/dictionary-db-connector'

interface FromAnswer {
    from: number
}

interface PhraseAnswer {
    phrase: string
}

interface ContinueAnswer {
    continue: boolean
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
    private dictionaryDb: DictionaryDbConnector

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
        this.dictionaryDb = new DictionaryDbConnector()

        this.learnNextWord()
    }

    learnNextWord = async (): Promise<void> => {
        const word: string = this.words[this.currentWordIndex++]

        console.log('learning word: ', word)

        const phrases: Phrase[] = await this.phraseSupplier.getPhrases(word)

        const phraseAnswer: PhraseAnswer = await inquirer.prompt<PhraseAnswer>({
            type: 'rawlist',
            name: 'phrase',
            message: 'Choose phrase to learn',
            choices: phrases.map(p => `${p.phrase} (${p.src})`)
        })

        const userTranslation: string = await this.getUserTranslationOfPhrase(phraseAnswer.phrase)

        await this.dictionaryDb.add({
            word,
            phrase: phraseAnswer.phrase,
            translation: userTranslation
        })

        const continueAnswer: ContinueAnswer = await inquirer.prompt<ContinueAnswer>({
            type: 'confirm',
            name: 'continue',
            message: 'Translation added. Want to learn next word' + ` "${this.words[this.currentWordIndex]}"?`,
            default: true
        })

        if (continueAnswer.continue) {
            this.learnNextWord()
        } else {
            return process.exit(0)
        }

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
