import axios, { AxiosResponse } from 'axios'
import { Phrase, PhraseSupplier } from './phrase-supplier'

export class FrazeItPhrasesService implements PhraseSupplier {

    apiKey: string

    constructor(apiKey: string) {
        this.apiKey = apiKey
    }

    getPhrases = async (enText: string): Promise<Phrase[]> => {
        const url: string = 'https://fraze.it/api/phrase'
            + `/${enText.trim().split(' ').join('+')}`
            + `/en`
            + `/1`
            + `/no`
            + `/${this.apiKey}`

        try {
            let response: AxiosResponse = await axios.get(url)
            return response.data.results
        } catch (error) {
            console.error(error)
        }
    }

    getPhrasesFr = async (frText: string): Promise<Phrase[]> => {
        const url: string = 'https://fraze.it/api/phrase'
            + `/${frText.trim().split(' ').join('+')}`
            + `/fr`
            + `/1`
            + `/no`
            + `/${this.apiKey}`

        try {
            let response: AxiosResponse = await axios.get(url)
            if (typeof response.data === "string") {
                throw new Error(response.data)
            }
            return response.data.results
        } catch (error) {
            console.error(error)
        }
    }
}
