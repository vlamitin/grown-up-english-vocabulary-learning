import * as path from 'path'
import { DbConnector, USER_DICTIONARY } from './db-connector'

export interface DictionaryItem {
    word: string
    phrase: string
    translation: string
}

export class DictionaryDbConnector extends DbConnector<DictionaryItem> {
    constructor() {
        super(USER_DICTIONARY, path.join(__dirname, '../../../db'))
    }
}
