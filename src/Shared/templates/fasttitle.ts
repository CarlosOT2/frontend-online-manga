//# Type //
import type { fasttitle } from '../types/Data/title'

let nextId = 0;

export function createFastTitle(): fasttitle {
    return {
        id: nextId++,
        name: 'Title Name',
        img: 'Img',
        alternativenames: [{ name: 'Alternative Name', languageId: 1 } ]
    }
}