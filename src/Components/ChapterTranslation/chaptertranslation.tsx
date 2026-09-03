//# Components //
import Img from '../Global/img';
import Button from '../Global/Inputs/button';
//# Libs //
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
//# Api //
import { GetChapterTranslation } from '../../Shared/api/FetchChapterTranslation'
//# Types //
import { chaptertranslation } from '../../Shared/types/Data/chaptertranslation';
//# Classes //
import './chaptertranslation.scss'
import './footerct.scss'
import './headerct.scss'

function HeaderCt({ data, imageIndex }: { data: chaptertranslation, imageIndex: number }) {
    return (
        <header className='headerct'>
            {imageIndex}
        </header>
    )
}
function FooterCt({ data }: { data: chaptertranslation }) {
    return (
        <footer className='footerct'>
        </footer>
    )
}
export default function ChapterTranslation() {
    const { chapterTranslationId } = useParams();
    const [data, setData] = useState<chaptertranslation>()
    const [imageIndex, setImageIndex] = useState<number>(0)

    async function req() {
        const res = await GetChapterTranslation(Number(chapterTranslationId))
        if (res) setData(res)
    }
    function handleTitleSwitch(direction: number) {
        if (!data) return

        let newImageIndex = imageIndex + Math.sign(direction)
        if (newImageIndex >= data.pages.length) newImageIndex = 0
        if (newImageIndex < 0) newImageIndex = data.pages.length - 1

        setImageIndex(newImageIndex)
    }

    useEffect(() => {
        req()
    }, [chapterTranslationId])

    return (
        <>
            <HeaderCt data={data as chaptertranslation} imageIndex={imageIndex} />
            <section className='chaptertranslation__pages'>
                <div className='chaptertranslation__pages__container'>
                    <Img
                        className='chaptertranslation__pages__img'
                        src={data?.pages[imageIndex].imageUrl}
                    />
                    <Button
                        type='button'
                        defaultStyle={false}
                        className='chaptertranslation__pages__button--left'
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            handleTitleSwitch(-1)
                        }}
                    />
                    <Button
                        type='button'
                        defaultStyle={false}
                        className='chaptertranslation__pages__button--right'
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            handleTitleSwitch(1)
                        }}
                    />
                </div>
            </section>
            <FooterCt data={data as chaptertranslation} />
        </>
    )
}