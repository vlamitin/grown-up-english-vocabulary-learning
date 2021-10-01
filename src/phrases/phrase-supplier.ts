
export interface Phrase {
    phrase: string
    src: string
}

export interface PhraseSupplier {
    getPhrases: (enText: string) => Promise<Phrase[]>
    getPhrasesFr: (frText: string) => Promise<Phrase[]>
}
