//# Components //
import Text from '../text'
import Link from '../link'
import Img from '../img'
import PreviewLine from '../previewline'
//# Utils //
import chunkArray from '../../../Shared/utils/chunkArray'
import { staticMapper } from '../../../Shared/utils/staticHandler'
//# Templates //
import { createTitle } from '../../../Shared/templates/title'
//# Types //
import { title } from '../../../Shared/types/Data/title'
//# Config //
import { grid } from '../../../config/Components/title'
//# Classes //
import './titlesgrid.scss'

type Variant = 'card' | 'compact'

type TitlesGrid = {
    data?: title[],
    variant: 'card' | 'compact'
}

function TitleInfo({ title, variant, isLoading }: { title: title, variant: Variant, isLoading: boolean }) {

    return (

        isLoading ?
            <section className='titlegrid__item-info-container'>
                {
                    variant === "card"
                        ?
                        <>
                            <PreviewLine width="100%" height={24} />
                            <PreviewLine width="85%" height={18} />
                            <PreviewLine width="100%" height={15} marginTop={"5px"}/>
                            <PreviewLine width="100%" height={15}/>
                            <PreviewLine width="100%" height={15}/>
                            <PreviewLine width="80%" height={15}/>
                        </>
                        :
                        <>
                            <PreviewLine width="100%" height={24} />
                            <PreviewLine width="50%" height={16} />
                            <PreviewLine width="20%" height={16} />
                        </>
                }

            </section>
            :
            variant === 'card' ?
                <section className='titlegrid__item-info-container'>
                    <Text not_exceed_X={true} className={`titlegrid__item-name`} tag={'h3'}>
                        {title.name}
                    </Text>
                    <ul className='titlegrid__item-list'>
                        <li>
                            <Text no_select={true} not_exceed_X={true} className={`titlegrid__item-contentRating`} tag={'span'}>
                                {staticMapper("contentRatings", Number(title.contentRating))}
                            </Text>
                        </li>
                        <li>
                            <Text no_select={true} not_exceed_X={true} className={`titlegrid__item-demographic`} tag={'span'}>
                                {staticMapper("demographics", Number(title.demographic))}
                            </Text>
                        </li>
                        {
                            title.genres.map((g, i) =>
                                <li key={`genre-${i}`}>
                                    <Text no_select={true} not_exceed_X={true} className={`titlegrid__item-genre`} tag={'span'}>
                                        {staticMapper("genres", Number(g))}
                                    </Text>
                                </li>
                            )
                        }
                        {
                            title.themes.map((t, i) =>
                                <li key={`genre-${i}`}>
                                    <Text no_select={true} not_exceed_X={true} className={`titlegrid__item-theme`} tag={'span'}>
                                        {staticMapper("themes", Number(t))}
                                    </Text>
                                </li>
                            )
                        }
                    </ul>
                    <Text tag={'span'} not_exceed_Y={true}>
                        {title.synopsis}
                    </Text>
                </section>
                :
                <section className='titlegrid__item-info-container'>
                    <Text not_exceed_X={true} className={`titlegrid__item-name`} tag={'h3'}>
                        {title.name}
                    </Text>
                </section>

    )
}

function TitleItem({ title, variant, isLoading }: { title: title, variant: Variant, isLoading: boolean }) {
    return (
        <li key={`item-${title.id}`}>
            <Link
                to={`/title/${title.id}/${title.name}`}
                className='titlegrid__item__link'
            >
                <article className='titlegrid__item-article'>
                    <Img
                        className={'titlegrid__item-img'}
                        src={`/manga-teste.jpg`}
                        borderRadius={true}
                        noPreview={true}
                        alt={`Cover of ${title.name}`}
                    />
                    <TitleInfo title={title} variant={variant} isLoading={isLoading} />
                </article>
            </Link>
        </li>
    )
}

export default function TitlesGrid({
    data,
    variant
}: TitlesGrid) {
    const { items, columns } = grid[variant];
    const isLoading = data === undefined

    if (variant === "compact") {
        const frmtdData = chunkArray(
            data === undefined
                ? Array.from({ length: 20 }, createTitle)
                : data,
            items!
        ).slice(0, columns)

        return (
            <div
                className={`titlegrid titlegrid--${variant} ${isLoading && 'titlegrid--preview'}`}
                style={{
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                }}
            >
                {
                    Array.from({ length: columns }).map((_, column_i) =>
                        <ul className="titlegrid__list" key={column_i}>
                            {
                                frmtdData[column_i]?.map((title) => (
                                    <TitleItem
                                        key={title.id}
                                        title={title}
                                        variant={variant}
                                        isLoading={isLoading}
                                    />
                                ))
                            }
                        </ul>
                    )
                }
            </div>
        )
    }
    else if (variant === "card") {
        const frmtdData = data !== undefined ? data : Array.from({ length: 20 }, createTitle)
        return (
            <ul
                className={`titlegrid titlegrid--${variant} ${isLoading && 'titlegrid--preview'}`}
                style={{
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                }}
            >
                {
                    frmtdData.map((title) =>
                        <TitleItem
                            key={`item-${title.id}`}
                            title={title}
                            variant={variant}
                            isLoading={isLoading}
                        />
                    )
                }
            </ul>
        )
    }
    else {
        return <>INVALID VARIANT</>
    }
}