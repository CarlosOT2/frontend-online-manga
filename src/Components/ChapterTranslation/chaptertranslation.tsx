//# Components //
import Img from '../Global/img';
import Button from '../Global/Inputs/button';
import Text from '../Global/text';
import Link from '../Global/link';
import SelectInput from '../Global/Inputs/selectinput';
//# Libs //
import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router'
//# Api //
import { GetChapterTranslation } from '../../Shared/api/FetchChapterTranslation'
//# Types //
import { availablechaptertranslation, chaptertranslation } from '../../Shared/types/Data/chaptertranslation';
//# Config //
import { preloadImageAmount } from '../../config/chaptertranslation';
//# Classes //
import './chaptertranslation.scss'
import './footerct.scss'
import './asidect.scss'


function getFilteredChapters(translations: availablechaptertranslation[], currentTranslationId: number) {
    const currentTranslation = translations.find(translation => translation.translationId === currentTranslationId)
    if (!currentTranslation) return translations

    const currentScanId = currentTranslation.scanId;
    const chapterNumbers = [...new Set(translations.map(translation => translation.chapterNumber))];

    const filteredChapters = chapterNumbers.map(chapterNumber => {
        const translationFromCurrentScan = translations.find(
            translation =>
                translation.chapterNumber === chapterNumber && translation.scanId === currentScanId
        );

        if (translationFromCurrentScan) {
            return translationFromCurrentScan
        } else {
            return translations.find(translation => translation.chapterNumber === chapterNumber)!
        }
    });

    return filteredChapters.sort((a, b) => a.chapterNumber - b.chapterNumber)
}


//# Header
function AsideCt(
    {
        data,
        renderOverlayVisible,
        currentPage,
        setCurrentPage,
        currentChapterTranslationId
    }:
        {
            data?: chaptertranslation,
            renderOverlayVisible: boolean,
            currentPage: number,
            setCurrentPage: (page: number) => void;
            currentChapterTranslationId: string
        }
) {
    if (!data) return

    const navigate = useNavigate()
    const filteredChapters = getFilteredChapters(data.availableChaptersTranslations, Number(currentChapterTranslationId))
    return (
        <aside className={`asidect ${renderOverlayVisible ? '' : 'asidect--hide'}`}>
            <header className='asidect__header'>
                <section className='asidect__header__info'>
                    <Link to={`/title/${data.titleId}/${data.titleName}`} className='asidect__info__title-link'>
                        <Text tag='h2' className='asidect__info__title-link'>
                            {data.titleName}
                        </Text>
                    </Link>
                    <Text className='asidect__info__chapter-title' tag='span'>
                        {data.chapterTitle}
                    </Text>
                </section>
            </header>

            <SelectInput
                name="pages"
                value={currentPage}
                className={`asidect__input-select`}
                onChange={(event) => setCurrentPage(Number(event.target.value))}
            >
                {data.pages.map((page, index) => (
                    <option key={page.id} value={index}>
                        Page {index + 1}
                    </option>
                ))}
            </SelectInput>
            <SelectInput
                name="Chapters"
                className={`asidect__input-select`}
                value={currentChapterTranslationId}
                onChange={(event) => {
                    const translationId = Number(event.target.value)
                    navigate(`/title/${data.titleId}/${data.titleName}/chaptertranslation/${translationId}`);
                }}
            >
                {filteredChapters.map((chaptertranslation, index) => (
                    <option key={index} value={chaptertranslation.translationId}>
                        Chapter {chaptertranslation.chapterNumber}
                    </option>
                ))}
            </SelectInput>
            <footer className="asidect__footer">

            </footer>
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
function FooterCt({ totalPages, currentPage, renderOverlayVisible }: { totalPages: number, currentPage: number, renderOverlayVisible: boolean }) {
    return (
        <footer className={`footerct ${renderOverlayVisible ? 'footerct--hide' : ''}`}>
            <ChapterProgress currentPage={currentPage + 1} totalPages={totalPages} />
        </footer>
    )
}
export default function ChapterTranslation() {
    const { chapterTranslationId } = useParams();
    const navigate = useNavigate()
    const preloadedUrls = useRef(new Set<string>());

    const [data, setData] = useState<chaptertranslation>()
    const [renderOverlayVisible, setRenderOverlayVisible] = useState(true)
    const [currentPage, setCurrentPage] = useState(0);


    function changeChapter(direction: number) {
        if (!data) return;

        const filteredChapters = getFilteredChapters(data.availableChaptersTranslations, Number(chapterTranslationId))
        const currentChapterIndex = filteredChapters.findIndex(chapter => chapter.translationId === Number(chapterTranslationId))

        if (currentChapterIndex === -1) return

        const newChapterIndex = currentChapterIndex + Math.sign(direction);
        const newChapter = filteredChapters[newChapterIndex];


        if (newChapter) {
            navigate(`/title/${data.titleId}/${data.titleName}/chaptertranslation/${newChapter.translationId}`)
        } else {
            navigate(`/title/${data.titleId}/${data.titleName}`)
        }
    }
    function preloadNextPages(pages: chaptertranslation["pages"], currentPage: number, preloadedUrls: Set<string>) {
        const nextPages = pages.slice(currentPage + 1, currentPage + 1 + preloadImageAmount)

        nextPages.forEach(page => {
            const imageUrl = page.imageUrl
            if (preloadedUrls.has(imageUrl)) return
            preloadedUrls.add(imageUrl)

            const image = new Image();
            image.onerror = () => { preloadedUrls.delete(imageUrl) }
            image.src = imageUrl
        });
    }

    function handleReaderOverlay() {
        setRenderOverlayVisible(current => !current);
    }
    function handleTitleSwitch(direction: number) {
        if (renderOverlayVisible) {
            setRenderOverlayVisible(false);
            return;
        }
        if (!data) return;

        const newCurrentPage = currentPage + Math.sign(direction);

        if (newCurrentPage >= data.pages.length) {
            changeChapter(1);
            return;
        }
        if (newCurrentPage < 0) {
            changeChapter(-1);
            return;
        }

        setCurrentPage(newCurrentPage);
    }

    useEffect(() => {
        setTimeout(() => {
            setRenderOverlayVisible(false)
        }, 1500);
    }, []);
    useEffect(() => {
        let requestCancelled = false;

        async function loadChapter() {
            setData(undefined)
            setCurrentPage(0)
            const res = await GetChapterTranslation(Number(chapterTranslationId));
            if (res) setData(res)
        }
        loadChapter()

        return () => { requestCancelled = true }
    }, [chapterTranslationId])
    useEffect(() => {
        if (!data) return
        preloadNextPages(data.pages, currentPage, preloadedUrls.current)
    }, [data, currentPage]);

    console.log(data)
    return (
        <>
            <section className='chaptertranslation__pages'>
                <div className='chaptertranslation__pages__container'>
                    <Img
                        key={`${chapterTranslationId}-${data?.pages[currentPage]?.id}`}
                        className='chaptertranslation__pages__img'
                        src={data?.pages[currentPage]?.imageUrl}
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
            <AsideCt
                data={data}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                renderOverlayVisible={renderOverlayVisible}
                currentChapterTranslationId={chapterTranslationId || ""}
            />
            <FooterCt
                totalPages={data?.pages.length || 0}
                currentPage={currentPage}
                renderOverlayVisible={renderOverlayVisible}
            />
        </>
    )
}