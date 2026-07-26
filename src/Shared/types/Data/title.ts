export type chapterTranslation = {
    id: number,
    chapterTitle: string,
    uploadedAt: string,
    viewCount: number,
    scanGroupName: string,
    languageId: number
}
export type chapter = {
    id: number,
    number: number
    translations: chapterTranslation[]
}
export type alternativename = { name: string, languageId: number }

type titlebase = {
    id: number
    name: string
    synopsis: string
    publicationDate: string
    img: string

    createdAt: string

    status: string
    contentRating: string
    demographic: string
}

export type fasttitle = {
    id: number
    name: string
    img: string
    alternativenames?: alternativename[]
}
export type titlecompact = titlebase

export type title = titlebase & {
    authors: string[]
    artists: string[]

    genres: string[]
    themes: string[]

    chapters?: chapter[]
    alternativenames?: alternativename[]
}

export type titlemetakeys = keyof Omit<title, "id" | "name" | "synopsis" | "img" | "chapters" | "alternativenames" | "createdAt">