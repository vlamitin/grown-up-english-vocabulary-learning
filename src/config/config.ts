import * as path from 'path'
import * as fs from 'fs'
import { WordsSource } from '../words-supplier/top-frequency-words-supplier'

const CONFIG_PATH: string = path.resolve(__dirname, '../../../resources/config.json')

class Config {
    yandexApiKey: string
    yandexCloudApiKey: string
    yandexCloudFolderId: string
    frazeItApiKey: string
    rapidapiKey: string

    load = async (): Promise<void> => {
        return new Promise<WordsSource>(resolve => {
            fs.readFile(CONFIG_PATH, (err, data) => {
                resolve(JSON.parse(String(data)))
            })
        })
            .then((loadedConfig: any) => {
                this.yandexApiKey = loadedConfig.yandexApiKey
                this.yandexCloudApiKey = loadedConfig.yandexCloudApiKey
                this.yandexCloudFolderId = loadedConfig.yandexCloudFolderId
                this.frazeItApiKey = loadedConfig.frazeItApiKey
                this.rapidapiKey = loadedConfig.rapidapiKey
            })
    }

}

export const config: Config = new Config()
