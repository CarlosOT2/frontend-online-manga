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
export type chapters = chapter[]

export type alternativename = { name: string, languageId: number }

export type title = {
    id: number
    name: string
    synopsis: string
    publicationDate: string
    img: string

    authors: string[]
    artists: string[]

    genres: string[]
    themes: string[]

    contentRating: string
    demographic: string
    status: string

    chapters?: chapters
    alternativenames?: alternativename[]
}

export type titlemetakeys = keyof Omit<title, "id" | "name" | "synopsis" | "publicationDate" | "img" | "chapters" | "alternativenames">