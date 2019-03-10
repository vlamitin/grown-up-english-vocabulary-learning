import * as path from 'path'
import * as fs from 'fs'

export enum SortMethod {
    FREQUENCY = 'frequency',
    ALPHABETICAL = 'alphabetical'
}

export interface WordsSource {
    source: string
    copyRightRestrictions: string
    sortMethod: SortMethod
    words: string[]
}

const WORDS_PATH: string = path.resolve(__dirname, '../../../resources/top-10000-frequency-sorted.json')

class TopFrequencyWordsSupplier {
    supply = async (): Promise<WordsSource> => {
        return new Promise<WordsSource>(resolve => {
            fs.readFile(WORDS_PATH, (err, data) => {
                return resolve(JSON.parse(String(data)) as WordsSource)
            })
        })
    }
}

export const topFrequencyWordsSupplier: TopFrequencyWordsSupplier = new TopFrequencyWordsSupplier()
