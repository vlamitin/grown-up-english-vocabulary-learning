import { config } from '../config/config'
import { TranslationResult } from '../words-translator/translator'
import { YandexCloudTranslate } from '../words-translator/yandex-cloud-translate'

const usage: string =
    `    usage:          "npm run cli -- translate ...args"
    example:            "npm run cli -- show-words -f 100 -t 200"

    args:
        "-h":                   show usage info
        "--text <<string>>":    text to translate
`

export async function translate(argv: any): Promise<void> {
    if (argv.h) {
        console.log(usage)
        return process.exit(0)
    }

    await config.load()
    const result: TranslationResult = await new YandexCloudTranslate(
        config.yandexCloudIamToken,
        config.yandexCloudFolderId,
    )
        .enToRus(argv.text)

    console.log(`
(!) ${result.legalInfo.text}
(!) see ${result.legalInfo.link}

${argv.text}
${result.results.join(', ')}`)
}
