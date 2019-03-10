import { isNil } from 'lodash'
import { topFrequencyWordsSupplier, WordsSource } from './top-frequency-words-supplier'

export async function getFrequencySortedWords(from?: number, to?: number): Promise<string[]> {
    const source: WordsSource = await topFrequencyWordsSupplier.supply()
    return source.words.slice(from, to)
}
