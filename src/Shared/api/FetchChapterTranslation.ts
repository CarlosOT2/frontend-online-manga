//# Services //
import PerformFetch from './PerformFetch'
//# Types //
import type { chaptertranslation } from '../types/Data/chaptertranslation'

export async function GetChapterTranslation(id: number) {
    return await PerformFetch<chaptertranslation>({ url: `/ChapterTranslation?id=${id}` })
}
