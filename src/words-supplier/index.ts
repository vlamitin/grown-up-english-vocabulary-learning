import { topFrequencyWordsSupplier, WordsSource } from './top-frequency-words-supplier'

export enum SortMethod {
    FREQUENCY = 'frequency',
    ALPHABETICAL = 'alphabetical'
}

export async function wordsSupplier(sortMethod: SortMethod): Promise<string[]> {
    if (sortMethod === SortMethod.FREQUENCY) {
        const source: WordsSource = await topFrequencyWordsSupplier.supply()
        return source.words
    }

    return Promise.resolve([])
}
