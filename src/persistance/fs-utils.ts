import * as fs from 'fs'

export const exists = (fileName: string): boolean => {
    try {
        return Boolean(fs.lstatSync(fileName))
    } catch (err) {
        return false
    }
}

export const create = (fileName: string): boolean => {
    try {
        fs.writeFileSync(fileName, '')
        return true
    } catch (err) {
        return false
    }
}

export const remove = (fileName: string): boolean => {
    try {
        fs.unlinkSync(fileName)
        return true
    } catch (err) {
        return false
    }
}
