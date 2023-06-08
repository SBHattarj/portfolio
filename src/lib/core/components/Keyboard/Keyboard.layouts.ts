import type { Entries } from "$lib/core/utils/object"

const keyboardsBase = {
    "Virtual": {
        "ABC": [
            ['q',         'w',         'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            ['a',         's',         'd', 'f', 'g', 'h', 'j', 'k', 'l', '\''],
            ['ABC-Shift', 'ABC-Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
            ['?123',      '?123',      ',', ' ', ' ', ' ', ' ', ' ', '.', '\n']
        ],
        "ABC-Shift": [
            ['Q',     'W',     'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A',     'S',     'D', 'F', 'G', 'H', 'J', 'K', 'L',  '"'],
            ['ABC',   'ABC',   'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
            ['?123',  '?123',  ',', ' ', ' ', ' ', ' ', ' ', '.', '\n']
        ],
        "?123": [
            ['1',   '2',   '3', '4',  '5', '6', '7', '8', '9', '0', '~', '^'],
            ['@',   '#',   '$', '_',  '&', '-', '+', '(', ')', '/', '|', '\\'],
            ['=',   '*',   '"', '\'', ':', ';', '!', '?', '{', '}', '%', 'Backspace'],
            ['ABC', 'ABC', '<', ' ',  ' ', ' ', ' ', ' ', '>', '[', ']', '\n']
        ],
    } as const,
    "Physical": {
        "Normal": [
            ['`',        '1',     '2', '3', '4', '5', '6', '7', '8', '9', '0', '-',  '=',     'Backspace'],
            ['',         'q',     'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[',  ']',     '\\'],
            ['Capslock', 'a',     's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', '\n',    '\n'],
            ['Shift',    'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/',  'Shift', 'Shift'],
            ['',          '',     '',  ' ', ' ', ' ', ' ', ' ', '',  '',  '',  '',   '',      ''],

        ],
        "Shift": [
            ['~',                   '!',      '@', '#', '$', '%', '^', '&', '*', '(', ')', '_',  '+',     'Backspace'],
            ['',                    'Q',      'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{',  '}',     '|'],
            ['Capslock-Shift',      'A',      'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', '\n',     '\n'],
            ['Normal',              'Normal', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', 'Normal', 'Normal'],
            ['',                    '',       '',  ' ', ' ', ' ', ' ', ' ', '',  '',  '',  '',   '',      ''],
        ],
        "Capslock": [
            ['`',                 '1',              '2', '3', '4', '5', '6', '7', '8', '9', '0',  '-',  '=',              'Backspace'],
            ['',                  'Q',              'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',  '[',  ']',              '\\'],
            ['Normal',            'A',              'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';',  '\'', '\n',             '\n'],
            ['Capslock-Shift',    'Capslock-Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.',  '/',  'Capslock-Shift', 'Capslock-Shift'],
            ['',                   '',              '',  ' ', ' ', ' ', ' ', ' ', '',  '',  '',   '',   '',               ''],
        ],
        "Capslock-Shift": [
            ['~',        '!',        '@', '#', '$', '%', '^', '&', '*', '(', ')', '_',  '+',       'Backspace'],
            ['',         'q',        'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '{',  '}',       '|'],
            ['Shift',    'a',        's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ':', '"', '\n',       '\n'],
            ['Capslock', 'Capslock', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '<', '>', '?', 'Capslock', 'Capslock'],
            ['',          '',        '',  ' ', ' ', ' ', ' ', ' ', '',  '',  '',  '',   '',        ''],
        ]
    } as const
}

export const keyboards: {
    ["Virtual"]: (typeof keyboardsBase["Virtual"]) & (typeof keyboardsBase["Physical"])
    ["Physical"]: (typeof keyboardsBase["Virtual"]) & (typeof keyboardsBase["Physical"])
} = keyboardsBase as any

export const VirtualGrid: {[key: string]: string[][]} = {
    "ABC": [
        ['q',     'w',     'e',     'r',     't',     'y',     'u',     'i',     'o',   'p'],
        ['a',     's',     'd',     'f',     'g',     'h',     'j',     'k',     'l',   'sq'],
        ['Shift', 'Shift', 'z',     'x',     'c',     'v',     'b',     'n',     'm',   'Backspace'],
        ['Num',   'Num',   'Comma', 'Space', 'Space', 'Space', 'Space', 'Space', 'Dot', 'Enter']
    ],
    "ABC-Shift": [
        ['Q',     'W',     'E',     'R',     'T',     'Y',     'U',     'I',     'O',   'P'],
        ['A',     'S',     'D',     'F',     'G',     'H',     'J',     'K',     'L',   'dblq'],
        ['Shift', 'Shift', 'Z',     'X',     'C',     'V',     'B',     'N',     'M',   'Backspace'],
        ['Num',   'Num',   'Comma', 'Space', 'Space', 'Space', 'Space', 'Space', 'Dot', 'Enter']
    ],
    "?123": [
        ['Num1',  'Num2', 'Num3', 'Num4',       'Num5',  'Num6',     'Num7',        'Num8',     'Num9',     'Num0',   'tilde',   'carot'],
        ['at',    'hash', 'dolar','underscore', 'and',   'minus',    'plus',        'nbrstart', 'nbrend',   'slash',  'pipe',    'backslash'],
        ['equal', 'star', 'dblq', 'sq',         'colon', 'smicolon', 'exclamation', 'question', 'cbrstart', 'cbrend', 'percent', 'Backspace'],
        ['ABC',   'ABC',  'lt',   'Space',      'Space', 'Space',    'Space',       'Space',    'gt',       'bbstart','bbend',   'Enter']
    ]
}

export type KeyboardTypes = keyof (typeof keyboards)
export type KeyboardModes = keyof (typeof keyboardsBase)['Virtual'] | keyof (typeof keyboardsBase)['Physical']
export type KeyboardEntries = Entries<(typeof keyboardsBase)['Virtual']> | Entries<(typeof keyboardsBase)['Physical']>
export type KeyboardTypeType = (typeof keyboardsBase)['Virtual'] & (typeof keyboardsBase)['Physical']
