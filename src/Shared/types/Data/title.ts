export type chapter = { id: number, number: number}
export type chapters = chapter[]

export type alternativename = { name: string, languageId: number }
export type alternativenames = alternativename[]

export type title = {
    id: number
    name: string
    synopsis: string
    releaseDate: string
    img: string

    authors: string[]
    artists: string[]

    genres: string[]
    themes: string[]

    contentRating: string
    demographic: string
    status: string

    chapters: chapters
    alternativenames: alternativenames
}

export type titlemetakeys = keyof Omit<title, "id" | "name" | "synopsis" | "releaseDate" | "img">