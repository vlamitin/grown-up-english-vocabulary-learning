import * as fs from 'fs'

import { exists, create, remove } from './fs-utils'

export type Collection = 'userDictionary'

export const USER_DICTIONARY: Collection = 'userDictionary'

export class DbConnector<T> {

    collection: string
    filePath: string

    constructor(collection: Collection, collectionsPath: string) {
        this.setFilePath(collection, collectionsPath)

        if (!exists(this.filePath)) {
            try {
                fs.writeFileSync(this.filePath, JSON.stringify({ items: [] }, null, 4))
            } catch (e) {
                console.error('create file error', e)
            }
        }
        this.collection = collection
    }

    // find(searchParams) {
    //     return this.read()
    //         .then((fileObj) => {
    //             if (searchParams) {
    //                 return fileObj[this.collection].filter((item: T) => {
    //                     let fitsSearchParams = true
    //                     Object.keys(searchParams).forEach((key: string) => {
    //                         if (typeof searchParams[key] !== 'object') {
    //                             if (!(key in item) || item[key] !== searchParams[key]) {
    //                                 fitsSearchParams = false
    //                             }
    //                             return fitsSearchParams
    //                         }
    //
    //                         if (searchParams[key].$gt && item[key] <= searchParams[key].$gt) {
    //                             fitsSearchParams = false
    //                         }
    //
    //                         if (searchParams[key].$lt && item[key] >= searchParams[key].$lt) {
    //                             fitsSearchParams = false
    //                         }
    //                     })
    //
    //                     return fitsSearchParams
    //                 })
    //             }
    //
    //             return fileObj[this.collection]
    //         })
    // }
    //

    add(item: T): Promise<void> {
        return this.read()
            .then((items: T[]) => {
                if (!items) {
                    this.drop()
                    return this.add(item)
                }
                let newCollection = [...items, item]

                return this.write(newCollection)
            })
    }
    //
    // addMany(items) {
    //     return this.read()
    //         .then((fileObj) => {
    //             let prevCollection = fileObj[this.collection]
    //             if (!prevCollection) {
    //                 this.drop()
    //                 return this.addMany(items)
    //             }
    //             let newCollection = [...prevCollection, ...items]
    //
    //             return this.write(newCollection)
    //         })
    // }
    //
    // findOne(searchParams) {
    //     return this.read()
    //         .then((fileObj) => {
    //             let prevCollection = fileObj[this.collection]
    //
    //             return prevCollection.find((item) => {
    //                 let fitsSearchParams = true
    //                 Object.keys(searchParams).forEach((key) => {
    //                     if (!(key in item) || item[key] !== searchParams[key]) {
    //                         fitsSearchParams = false
    //                     }
    //                 })
    //
    //                 return fitsSearchParams
    //             })
    //         })
    // }
    //
    // findOneAndUpdate(searchParams, updateParams) {
    //     return this.read()
    //         .then((fileObj) => {
    //             let prevCollection = fileObj[this.collection]
    //
    //             let newCollection = prevCollection.map((item) => {
    //                 let fitsSearchParams = true
    //                 Object.keys(searchParams).forEach((key) => {
    //                     if (!(key in item) || item[key] !== searchParams[key]) {
    //                         fitsSearchParams = false
    //                     }
    //                 })
    //
    //                 if (!fitsSearchParams) {
    //                     return item
    //                 }
    //
    //                 return Object.assign(item, updateParams)
    //             })
    //             return this.write(newCollection)
    //         })
    // }
    //
    // findOneAndRemove(searchParams) {
    //     return this.read()
    //         .then((fileObj) => {
    //             let prevCollection = fileObj[this.collection]
    //
    //             let newCollection = prevCollection.filter((item) => {
    //                 let fitsSearchParams = true
    //                 Object.keys(searchParams).forEach((key) => {
    //                     if (!(key in item) || item[key] !== searchParams[key]) {
    //                         fitsSearchParams = false
    //                     }
    //                 })
    //
    //                 if (!fitsSearchParams) {
    //                     return item
    //                 }
    //             })
    //             return this.write(newCollection)
    //         })
    // }
    //

    private read(): Promise<T[]> {
        return new Promise((resolve, reject) => {
            fs.readFile(this.filePath, 'utf8', (err, data) => {
                if (err) {
                    reject(err)
                }
                try {
                    resolve(JSON.parse(data).items)
                } catch (err2) {
                    reject(err2)
                }
            })
        })
    }

    private write(items: T[]): Promise<void> {
        return new Promise((resolve, reject) => {
            let lockName = this.filePath + '.lock'

            if (exists(lockName)) {
                const RETRY_TIME = 100
                return new Promise(resolve1 => {
                    setTimeout(() => {
                        resolve1(this.write(items))
                    }, RETRY_TIME)
                })

            }

            create(lockName)

            let newData = JSON.stringify({ items }, null, 4)

            fs.writeFile(
                this.filePath,
                newData,
                {
                    encoding: 'utf8'
                },
                err => {
                    remove(lockName)
                    if (!err) {
                        resolve()
                    } else {
                        reject(err)
                    }
                }
            )
        })
    }

    private drop(): Promise<void> {
        return this.write([])
    }

    private setFilePath(collection: string, collectionsPath: string): void {
        this.filePath = `${collectionsPath}/${collection}.json`
    }
}
