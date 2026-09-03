export type chaptertranslationpage = {
    id: number
    pageNumber: number,
    imageUrl: string
}

export type chaptertranslation = {
    id: number,
    titleId: number,
    titleName: string,
    chapterNumber: number,
    chapterTitle: string,
    scanName: string,
    languageId: number,
    pages: chaptertranslationpage[]
}