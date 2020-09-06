const url = require('url')
import axios, { AxiosResponse } from 'axios'
import { TranslationResult, Translator } from './translator'

export class RapidapiGoogleTranslateService implements Translator {

    apiKey: string

    constructor(apiKey: string) {
        this.apiKey = apiKey
    }

    enToRus = async (enText: string): Promise<TranslationResult> => {
        try {
            let response: AxiosResponse = await axios.request({
                url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
                method: 'POST',
                headers: {
                    'x-rapidapi-host': 'google-translate1.p.rapidapi.com',
                    'x-rapidapi-key': this.apiKey,
                    'accept-encoding': 'application/gzip',
                    'content-type': 'application/x-www-form-urlencoded',
                    'useQueryString': true
                },
                data: new url.URLSearchParams({
                    model: 'nmt',
                    format: 'text',
                    source: 'en',
                    q: enText,
                    target: 'ru'
                }).toString()
            })

            return {
                results: response.data.data.translations.map(tr => tr.translatedText),
                legalInfo: {
                    link: '-',
                    text: '-',
                }
            }
        } catch (error) {
            console.error(error)
        }
    }
}
