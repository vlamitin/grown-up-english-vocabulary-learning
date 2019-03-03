import axios, { AxiosResponse } from 'axios'
import path from 'path'
import { SortMethod } from './index'

export interface WordsSource {
    source: string
    copyRightRestrictions: string
    sortMethod: SortMethod
    words: string[]
}

const WORDS_PATH: string = path.resolve(__dirname, '../../../resources/top-10000-frequency-sorted.json')

class TopFrequencyWordsSupplier {
    supply = async (): Promise<WordsSource> => {
        const source: AxiosResponse<WordsSource> = await axios.get<WordsSource>(WORDS_PATH)
        return source.data
    }
}

export const topFrequencyWordsSupplier: TopFrequencyWordsSupplier = new TopFrequencyWordsSupplier()
