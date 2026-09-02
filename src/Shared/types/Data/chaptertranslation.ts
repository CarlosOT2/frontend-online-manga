export type chaptertranslationpage = {
    id: number
    pageNumber: number,
    imageUrl: string
}

export type chaptertranslation = {
    id: number,
    chapterNumber: number,
    languageId: number,
    pages: chaptertranslationpage[]
}