const url = require('url')
import axios, { AxiosResponse } from 'axios'
import { TranslationResult, Translator } from './translator'

export class YandexCloudTranslate implements Translator {

    yandexCloudIamToken: string
    yandexCloudFolderId: string

    constructor(yandexCloudIamToken: string, yandexCloudFolderId: string) {
        this.yandexCloudIamToken = yandexCloudIamToken
        this.yandexCloudFolderId = yandexCloudFolderId
    }

    enToRus = async (enText: string): Promise<TranslationResult> => {
        try {
            let response: AxiosResponse = await axios.request({
                url: 'https://translate.api.cloud.yandex.net/translate/v2/translate',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.yandexCloudIamToken}`,
                },
                data: {
                    folder_id: this.yandexCloudFolderId,
                    texts: [enText],
                    sourceLanguageCode: 'en',
                    targetLanguageCode: 'ru'
                }
            })

            return {
                results: response.data.translations.map(tr => tr.text),
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
