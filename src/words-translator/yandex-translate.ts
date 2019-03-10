/* tslint:disable:max-line-length */
// TODO! Лицензия яндекса! Нужно размещать плашку "переведено яндексом"
// https://yandex.ru/legal/translate_api/?lang=ru
// 2.7. При использовании Сервиса обязательно указание на технологию Яндекса путём размещения в описании программного продукта, в соответствующем разделе помощи, на официальном сайте программного продукта, а также на всех страницах/экранах, где используются данные сервиса «Яндекс.Переводчик» непосредственно над или под результатом перевода, текста «Переведено сервисом «Яндекс.Переводчик» с активной гиперссылкой на страницу http://translate.yandex.ru/. Данное указание должно быть выполнено шрифтом, размер которого не менее размера шрифта основного текста, и цвет которого не отличается от цвета шрифта основного текста.
/* tslint:enable */

import axios, { AxiosResponse } from 'axios'
import { LegalInfo, TranslationResult, Translator } from './translator'

const legalInfo: LegalInfo = {
    text: 'Переведено сервисом «Яндекс.Переводчик»',
    link: 'http://translate.yandex.ru/'
}

export class YandexTranslateService implements Translator{

    apiKey: string

    constructor(apiKey: string) {
        this.apiKey = apiKey
    }

    enToRus = async (enText: string): Promise<TranslationResult> => {
        const url: string = 'https://translate.yandex.net/api/v1.5/tr.json/translate'
            + `?key=${this.apiKey}`
            + `&text=${enText}`
            + `&lang=en-ru`

        try {
            let response: AxiosResponse = await axios.post(url)

            return {
                results: response.data.text,
                legalInfo
            }
        } catch (error) {
            console.error(error)
        }

    }

}
