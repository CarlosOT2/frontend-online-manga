//# Type //
import type { title } from '../types/Data/title'

let nextId = 0;

export function createTitle(): title {
    return {
        id: nextId++,
        name: 'Template',
        synopsis: 'Template',
        publicationDate: '2020-10-22 12:59:08.820831+00',
        img: 'Template',

        authors: ["1"],
        artists: ["1"],

        genres: ["1"],
        themes: ["1"],

        contentRating: '1',
        demographic: '1',
        status: '1',
    }
}