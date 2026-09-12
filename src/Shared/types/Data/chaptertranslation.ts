export type chaptertranslationpage = {
    id: number
    pageNumber: number,
    imageUrl: string
}

export type availablechaptertranslation = {
    translationId: number
    chapterNumber: number,
    scanId: number
}


export type chaptertranslation = {
    id: number,
    titleId: number,
    titleName: string,
    chapterNumber: number,
    chapterTitle: string,
    scanName: string,
    availableChaptersTranslations: availablechaptertranslation[],
    languageId: number,
    pages: chaptertranslationpage[]
}