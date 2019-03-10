export interface LegalInfo {
    text: string
    link: string
}

export interface TranslationResult {
    results: string[]
    legalInfo: LegalInfo
}

export interface Translator {
    enToRus: (enText: string) => Promise<TranslationResult>
}
