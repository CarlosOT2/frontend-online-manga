//# Components //
import Img from '../Global/img';
import Button from '../Global/Inputs/button';
import Text from '../Global/text';
import Link from '../Global/link';
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
import './asidect.scss'

//# Header
function AsideCt({ data, currentPage, renderOverlayVisible }: { data: chaptertranslation, currentPage: number, renderOverlayVisible: boolean }) {
    if (!data) return
    return (
        <aside className={`asidect ${renderOverlayVisible ? '' : 'asidect--hide'}`}>
            <section className='asidect__info'>
                <Text className='asidect__info__chapter-title' tag='h2'>
                    {data.chapterTitle}
                </Text>
                <Link to={`/title/${data.titleId}/${data.titleName}`} className='asidect__info__title-link'>
                    {data.titleName}
                </Link>
            </section>

        </aside>
    )
}
//# Footer
function ChapterProgress({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
    const progress = (currentPage / totalPages) * 100
    return (
        <nav className='footerct__progress'>
            <div className="footerct__progress-track">
                <div className="footerct__progress-fill" style={{ width: `${progress}%` }} />
            </div>
        </nav>
    )
}
function FooterCt({ data, currentPage, renderOverlayVisible }: { data: chaptertranslation, currentPage: number, renderOverlayVisible: boolean }) {
    if (!data) return
    return (
        <footer className={`footerct ${renderOverlayVisible ? 'footerct--hide' : ''}`}>
            <ChapterProgress currentPage={currentPage} totalPages={data?.pages.length} />
        </footer>
    )
}
export default function ChapterTranslation() {
    const { chapterTranslationId } = useParams();
    const [data, setData] = useState<chaptertranslation>()
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [renderOverlayVisible, setRenderOverlayVisible] = useState(true)

    async function req() {
        const res = await GetChapterTranslation(Number(chapterTranslationId))
        if (res) setData(res)
    }
    function handleReaderOverlay() {
        setRenderOverlayVisible(current => !current);
    }
    function handleTitleSwitch(direction: number) {
        if(renderOverlayVisible) {
            setRenderOverlayVisible(false) 
            return
        }
        if (!data) return

        let newImageIndex = currentPage + Math.sign(direction)
        if (newImageIndex >= data.pages.length) newImageIndex = 0
        if (newImageIndex < 0) newImageIndex = data.pages.length - 1

        setCurrentPage(newImageIndex)
    }

    useEffect(() => {
        setTimeout(() => {
            setRenderOverlayVisible(false)
        }, 3500);
    }, []);
    useEffect(() => {
        req()
    }, [chapterTranslationId])

    return (
        <>
            <section className='chaptertranslation__pages'>
                <div className='chaptertranslation__pages__container'>
                    <Img
                        className='chaptertranslation__pages__img'
                        src={data?.pages[currentPage].imageUrl}
                    />
                    <Button
                        type='button'
                        defaultStyle={false}
                        className='chaptertranslation__pages__button--left'
                        onClick={() => handleTitleSwitch(-1)}
                    />
                    <Button
                        type='button'
                        defaultStyle={false}
                        className='chaptertranslation__pages__button--center'
                        onClick={() => handleReaderOverlay()}
                    />
                    <Button
                        type='button'
                        defaultStyle={false}
                        className='chaptertranslation__pages__button--right'
                        onClick={() => handleTitleSwitch(1)}
                    />
                </div>
            </section>
            <AsideCt data={data as chaptertranslation} currentPage={currentPage} renderOverlayVisible={renderOverlayVisible} />
            <FooterCt data={data as chaptertranslation} currentPage={currentPage} renderOverlayVisible={renderOverlayVisible} />
        </>
    )
}