//# Libs //
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
//# Api //
import { GetChapterTranslation } from '../../Shared/api/FetchChapterTranslation'
//# Types //
import { chaptertranslation } from '../../Shared/types/Data/chaptertranslation';
//# Classes //
import './chaptertranslation.scss'


export default function ChapterTranslation() {
    //.. Variables
    const { chapterTranslationId } = useParams();

    //.. States
    const [data, setData] = useState<chaptertranslation>()
    
    async function req() {
        const res = await GetChapterTranslation(Number(chapterTranslationId))
        if (res) setData(res)
    }

    useEffect(() => {
        req()
    }, [chapterTranslationId])
    
    return (
        <>
        </>
    )
}