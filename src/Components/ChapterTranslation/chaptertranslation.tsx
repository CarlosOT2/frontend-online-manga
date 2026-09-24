//# Components
import Img from '../Global/img';
import Button from '../Global/Inputs/button';
import Text from '../Global/text';
import Link from '../Global/link';
//# Libs //
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
//# API //
import { GetChapterTranslation } from '../../Shared/api/FetchChapterTranslation';
//# Types //
import { availablechaptertranslation, chaptertranslation } from '../../Shared/types/Data/chaptertranslation';
//# Config //
import { preloadImageAmount } from '../../config/chaptertranslation';
//# Classes //
import './chaptertranslation.scss';
import './footerct.scss';
import './asidect.scss';
import './selectinputct.scss';
//# Icons //
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import { FaArrowLeft, FaArrowRight, FaBackwardStep, FaUserGroup } from 'react-icons/fa6';

//# Types //
type Option<T> = { label: string; value: T };
type Direction = -1 | 1;
type SelectInputCtProps<T> = {
    name: string;
    options: Option<T>[];
    selectedValue: T | undefined;
    isOpen: boolean;
    onToggle: () => void;
    onOptionSelect: (value: T) => void;
    onButtonPrevious: () => void;
    onButtonNext: () => void;
};
type AsideCtProps = {
    data?: chaptertranslation;
    visible: boolean;
    currentPage: number;
    currentChapterId: number;
    setCurrentPage: (index: number) => void;
    changePage: (direction: Direction, fromReader?: boolean) => void;
    changeChapter: (direction: Direction) => void;
};

//# Misc //
function getFilteredChapters(translations: availablechaptertranslation[], currentId: number) {
    const currentScanId = translations.find(item => item.translationId === currentId)?.scanId;
    if (currentScanId === undefined) return translations;

    const chapters = new Map<number, availablechaptertranslation>();
    for (const translation of translations) {
        const previous = chapters.get(translation.chapterNumber);
        if (!previous || (previous.scanId !== currentScanId && translation.scanId === currentScanId)) {
            chapters.set(translation.chapterNumber, translation);
        }
    }
    return [...chapters.values()].sort((a, b) => a.chapterNumber - b.chapterNumber);
}

//# Select Input
function SelectInputCt<T>({
    name, options, selectedValue, isOpen, onToggle, onOptionSelect, onButtonPrevious, onButtonNext
}: SelectInputCtProps<T>) {
    const selectedOption = options.find(option => option.value === selectedValue);
    const listRef = useRef<HTMLUListElement>(null);
    const selectedItemRef = useRef<HTMLLIElement>(null);

    //# useEffects //
    useEffect(() => {
        if (!isOpen || !listRef.current || !selectedItemRef.current) return
        const list = listRef.current
        const selectedItem = selectedItemRef.current
        list.scrollTop += selectedItem.getBoundingClientRect().top - list.getBoundingClientRect().top - (list.clientHeight - selectedItem.clientHeight) / 2
    }, [selectedOption])

    return (
        <div className="selectinputct">
            <Button defaultStyle={false} className="selectinputct__button-previous" onClick={onButtonPrevious}>
                <IoIosArrowBack className="selectinputct__icon--previous" />
            </Button>
            <div className="selectinputct__container">
                <Button
                    className={`selectinputct__button-trigger ${isOpen ? 'selectinputct__button-trigger--opened' : ''}`}
                    defaultStyle={false}
                    id={name}
                    onClick={onToggle}
                >
                    <Text tag="span" className="selectinputct__label1">{name}</Text>
                    <Text tag="span" className="selectinputct__label2">{selectedOption?.label ?? ''}</Text>
                    <IoIosArrowDown className={isOpen ? 'selectinputct__icon-trigger--open' : 'selectinputct__icon-trigger--closed'} />
                </Button>
                <ul
                    ref={listRef}
                    className={`selectinputct__list ${isOpen ? 'selectinputct__list--opened' : 'selectinputct__list--closed'}`}
                    aria-hidden={!isOpen}
                >
                    {options.map(option => (
                        <li
                            ref={option.value === selectedValue ? selectedItemRef : null}
                            key={String(option.value)}
                            className={`
                                selectinputct__list__item 
                                ${option.value == selectedValue && "selectinputct__list__item--selected"}`
                            }
                            onClick={() => {
                                onOptionSelect(option.value);
                            }}
                        >
                            <Text tag="span" className="selectinputct__list__item-text">{option.label}</Text>
                        </li>
                    ))}
                </ul>
            </div>
            <Button defaultStyle={false} className="selectinputct__button-next" onClick={onButtonNext}>
                <IoIosArrowForward className="selectinputct__icon--next" />
            </Button>
        </div>
    );
}

//# Aside //
function AsideCt({ data, visible, currentPage, currentChapterId, setCurrentPage, changePage, changeChapter }: AsideCtProps) {
    const navigate = useNavigate();
    const [openSelect, setOpenSelect] = useState<"pages" | "chapters" | null>(null);

    if (!data) return null;

    const titleUrl = `/title/${data.titleId}/${data.titleName}`;
    const pages: Option<number>[] = data.pages.map(page => ({ label: String(page.pageNumber), value: page.pageNumber }));
    const chapters: Option<number>[] = getFilteredChapters(data.availableChaptersTranslations, currentChapterId)
        .map(chapter => ({ label: String(chapter.chapterNumber), value: chapter.translationId }));

    return (
        <aside className={`asidect ${visible ? '' : 'asidect--hide'}`}>
            <header className="asidect__header">
                <section className="asidect__header__info">
                    <Link to={titleUrl} className="asidect__header__info__title-link">
                        <Text tag="h2" className="asidect__header__info__title-link">{data.titleName}</Text>
                    </Link>
                    <Text tag="span" className="asidect__header__info__chapter-title">{data.chapterTitle}</Text>
                </section>
            </header>
            <SelectInputCt
                name="Pages"
                options={pages}
                selectedValue={data.pages[currentPage]?.pageNumber}
                onOptionSelect={pageNumber => {
                    setOpenSelect(null)
                    const index = data.pages.findIndex(page => page.pageNumber === pageNumber);
                    if (index !== -1) setCurrentPage(index);
                }}

                isOpen={openSelect === "pages"}
                onToggle={() => setOpenSelect(current => current === "pages" ? null : "pages")}

                onButtonPrevious={() => changePage(-1, false)}
                onButtonNext={() => changePage(1, false)}
            />
            <SelectInputCt
                name="Chapters"
                options={chapters}
                selectedValue={currentChapterId}
                onOptionSelect={id => {
                    setOpenSelect(null)
                    navigate(`${titleUrl}/chaptertranslation/${id}`)
                }}

                isOpen={openSelect === "chapters"}
                onToggle={() => setOpenSelect(current => current === "chapters" ? null : "chapters")}


                onButtonPrevious={() => changeChapter(-1)}
                onButtonNext={() => changeChapter(1)}
            />
            <hr className="asidect__hr" />
            <section className="asidect__info">
                <Text tag="h2" className="asidect__info-title">Uploaded By</Text>
                <Text tag="span" className="asidect__info-text">
                    <FaUserGroup className="asidect__info-text__icon" /> {data.scanName}
                </Text>
            </section>
            <hr className="asidect__hr" />
            <footer className="asidect__footer">
                <Button
                    className="asidect__footer-button"
                    icon={<FaBackwardStep className="asidect__footer-icon" />}
                    onClick={() => setCurrentPage(0)}
                >
                    <Text tag="span" className="asidect__footer-text">Go to First Page</Text>
                </Button>
                <Button
                    className="asidect__footer-button"
                    icon={<FaArrowRight className="asidect__footer-icon" />}
                    onClick={() => changeChapter(1)}
                >
                    <Text tag="span" className="asidect__footer-text">Next Chapter</Text>
                </Button>
                <Button
                    className="asidect__footer-button"
                    icon={<FaArrowLeft className="asidect__footer-icon" />}
                    onClick={() => changeChapter(-1)}
                >
                    <Text tag="span" className="asidect__footer-text">Previous Chapter</Text>
                </Button>
            </footer>
        </aside>
    );
}

//# Footer //
function FooterCt({ totalPages, currentPage, visible }: { totalPages: number; currentPage: number; visible: boolean }) {
    const progress = totalPages > 0 ? ((currentPage + 1) / totalPages) * 100 : 0;
    return (
        <footer className={`footerct ${visible ? 'footerct--hide' : ''}`}>
            <nav className="footerct__progress">
                <div className="footerct__progress-track">
                    <div className="footerct__progress-fill" style={{ width: `${progress}%` }} />
                </div>
            </nav>
        </footer>
    );
}

export default function ChapterTranslation() {
    const { chapterTranslationId } = useParams();
    const navigate = useNavigate();
    const preloadedUrls = useRef(new Set<string>());

    const [data, setData] = useState<chaptertranslation>();
    const [currentPage, setCurrentPage] = useState(0);
    const [overlayVisible, setOverlayVisible] = useState(true);

    const currentChapterId = Number(chapterTranslationId);

    //# Functions //
    function changeChapter(direction: Direction) {
        if (!data) return;
        const chapters = getFilteredChapters(data.availableChaptersTranslations, currentChapterId);
        const index = chapters.findIndex(chapter => chapter.translationId === currentChapterId);
        if (index === -1) return;

        const next = chapters[index + direction];
        const titleUrl = `/title/${data.titleId}/${data.titleName}`;
        navigate(next ? `${titleUrl}/chaptertranslation/${next.translationId}` : titleUrl);
    }
    function changePage(direction: Direction, closeAsideOnClick = true) {
        if (closeAsideOnClick && overlayVisible) {
            setOverlayVisible(false);
            return;
        }
        if (!data) return;

        const next = currentPage + direction;
        if (next < 0 || next >= data.pages.length) {
            changeChapter(direction);
        } else {
            setCurrentPage(next);
        }
    }

    //# useEffects //
    useEffect(() => {
        let cancelled = false;
        setData(undefined);
        setCurrentPage(0);

        GetChapterTranslation(currentChapterId).then(result => {
            if (!cancelled && result) setData(result);
        });
        return () => { cancelled = true; };
    }, [chapterTranslationId]);
    useEffect(() => {
        if (!data) return;
        for (const page of data.pages.slice(currentPage + 1, currentPage + 1 + preloadImageAmount)) {
            if (preloadedUrls.current.has(page.imageUrl)) continue;
            preloadedUrls.current.add(page.imageUrl);
            const image = new Image();
            image.onerror = () => preloadedUrls.current.delete(page.imageUrl);
            image.src = page.imageUrl;
        }
    }, [data, currentPage]);

    return (
        <>
            <section className="chaptertranslation__pages">
                <div className="chaptertranslation__pages__container">
                    <Img
                        key={`${chapterTranslationId}-${data?.pages[currentPage]?.id}`}
                        className="chaptertranslation__pages__img"
                        src={data?.pages[currentPage]?.imageUrl}
                    />
                    <Button type="button" defaultStyle={false} className="chaptertranslation__pages__button--left" onClick={() => changePage(-1)} />
                    <Button type="button" defaultStyle={false} className="chaptertranslation__pages__button--center" onClick={() => setOverlayVisible(value => !value)} />
                    <Button type="button" defaultStyle={false} className="chaptertranslation__pages__button--right" onClick={() => changePage(1)} />
                </div>
            </section>
            <AsideCt
                data={data}
                visible={overlayVisible}
                currentPage={currentPage}
                currentChapterId={currentChapterId}
                setCurrentPage={setCurrentPage}
                changePage={changePage}
                changeChapter={changeChapter}
            />
            <FooterCt totalPages={data?.pages.length ?? 0} currentPage={currentPage} visible={overlayVisible} />
        </>
    );
}