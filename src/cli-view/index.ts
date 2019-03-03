#!/usr/bin/env node
import * as inquirer from 'inquirer'
import { SortMethod, wordsSupplier } from '../words-supplier'

enum WordSearchCommands {
    SHOW_FULL_LIST = 'Show full list',
    SELECT_BY_NUMBER = 'Select by number'
}

interface Answer<T> {
    command: T
}

inquirer
    .prompt<Answer<WordSearchCommands>>({
        type: 'list',
        name: 'command',
        message: 'What do you want?',
        choices: ['Show full list', 'Select by number']
    })
    .then(answer => {
        if (answer.command === WordSearchCommands.SHOW_FULL_LIST) {
            wordsSupplier(SortMethod.FREQUENCY)
                .then(words => {
                    console.log(words)
                })
        } else {
            inquirer.prompt({
                type: 'list',
                name: 'beverage',
                message: 'And your favorite beverage?',
                choices: ['Pepsi', 'Coke', '7up', 'Mountain Dew', 'Red Bull']
            })
        }
    })
