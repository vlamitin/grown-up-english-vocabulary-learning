import axios, { AxiosResponse } from 'axios'

export interface Phrase {
    phrase: string
    src: string
}

export class FrazeItPhrasesService {

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

}
