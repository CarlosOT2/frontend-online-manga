//# Components //
import Text from '../text'
import Link from '../link'
import Img from '../img'
import Button from '../Inputs/button'
import PreviewLine from '../previewline'

//# Libs //
import { useEffect, useState } from 'react'

//# Utils //
import { staticMapper } from '../../../Shared/utils/staticHandler'

//# Types //
import { title } from '../../../Shared/types/Data/title'

//# Classes //
import './featuredtitles.scss'

//# Icons //
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

type FeaturedTitlesProps = {
    data?: title[]
}

export default function FeaturedTitles({ data }: FeaturedTitlesProps) {
    const [titleIndex, setTitleIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    const titles = data ?? []
    const isLoading = data === undefined
    const hasTitles = titles.length > 0

    function handleTitleSwitch(direction: number) {
        if (!hasTitles)
            return

        let newIndex = titleIndex + direction

        if (newIndex < 0)
            newIndex = titles.length - 1

        if (newIndex >= titles.length)
            newIndex = 0

        setTitleIndex(newIndex)
    }

    useEffect(() => {
        if (isLoading || isPaused || !hasTitles)
            return

        const interval = setInterval(() => {
            setTitleIndex(prev =>
                prev >= titles.length - 1 ? 0 : prev + 1
            )
        }, 7500)

        return () => clearInterval(interval)
    }, [isLoading, isPaused, titles.length, hasTitles])

    return (
        <section
            className="featuredtitles"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <ul
                className="featuredtitles__track"
                style={{
                    transform: `translateX(-${titleIndex * 100}%)`
                }}
            >
                {!isLoading ? (
                    titles.map((title, index) => (
                        <li
                            className="featuredtitles__slide"
                            key={`slide-${index}`}
                        >
                            <Link to={`/title/${title.id}/${title.name}`}>
                                <article className="featuredtitles__card">
                                    <Img
                                        borderRadius
                                        className="featuredtitles__card__img"
                                        src="/manga-teste.jpg"
                                    />

                                    <section className="featuredtitles__card__section">
                                        <Text
                                            not_exceed_X
                                            className="featuredtitles__card__name"
                                            tag="h3"
                                        >
                                            {title.name}
                                        </Text>

                                        <ul className="featuredtitles__card__list">
                                            <li>
                                                <Text
                                                    no_select
                                                    not_exceed_X
                                                    className="featuredtitles__card__contentRating"
                                                    tag="span"
                                                >
                                                    {staticMapper(
                                                        'contentRatings',
                                                        Number(title.contentRating)
                                                    )}
                                                </Text>
                                            </li>

                                            <li>
                                                <Text
                                                    no_select
                                                    not_exceed_X
                                                    className="featuredtitles__card__demographic"
                                                    tag="span"
                                                >
                                                    {staticMapper(
                                                        'demographics',
                                                        Number(title.demographic)
                                                    )}
                                                </Text>
                                            </li>

                                            {title.genres
                                                .slice(0, 5)
                                                .map((genre, genreIndex) => (
                                                    <li key={`genre-${genreIndex}`}>
                                                        <Text
                                                            no_select
                                                            not_exceed_X
                                                            className="featuredtitles__card__genre"
                                                            tag="span"
                                                        >
                                                            {staticMapper(
                                                                'genres',
                                                                Number(genre)
                                                            )}
                                                        </Text>
                                                    </li>
                                                ))}
                                        </ul>

                                        <Text
                                            className="featuredtitles__card__synopsis"
                                            tag="span"
                                            not_exceed_Y
                                        >
                                            {title.synopsis}
                                        </Text>

                                        <footer className="featuredtitles__card__footer">
                                            <Text
                                                className="featuredtitles__card__authors"
                                                not_exceed_X
                                                tag="p"
                                            >
                                                {title.authors
                                                    ?.slice(0, 6)
                                                    .join(', ')}
                                            </Text>
                                        </footer>
                                    </section>
                                </article>
                            </Link>
                        </li>
                    ))
                ) : (
                    <li
                        className="featuredtitles__slide"
                        key="slide-preview"
                    >
                        <Link to="/">
                            <article className="featuredtitles__card">
                                <Img
                                    borderRadius
                                    className="featuredtitles__card__img"
                                    src="/manga-teste.jpg"
                                />

                                <section className="featuredtitles__card__section">
                                    <PreviewLine width="100%" height={25} />
                                    <PreviewLine width="70%" height={20} />
                                    <PreviewLine width="100%" height={15} marginTop={"5px"} />
                                    <PreviewLine width="100%" height={15} />
                                    <PreviewLine width="100%" height={15} />
                                    <PreviewLine width="100%" height={15} />
                                    <PreviewLine width="80%" height={15} />
                                    <PreviewLine width="50%" height={20} marginTop={"auto"} />
                                </section>
                            </article>
                        </Link>
                    </li>
                )}
            </ul>

            {!isLoading && hasTitles && (
                <div className="featuredtitles__buttons">
                    <Button
                        className="featuredtitles__buttons__button--left"
                        icon={<FaChevronLeft />}
                        defaultStyle={false}
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleTitleSwitch(-1)
                        }}
                    />

                    <Button
                        className="featuredtitles__buttons__button--right"
                        icon={<FaChevronRight />}
                        defaultStyle={false}
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleTitleSwitch(1)
                        }}
                    />
                </div>
            )}
        </section>
    )
}