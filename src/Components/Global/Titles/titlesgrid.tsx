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
import { createLatestUpdate } from '../../../Shared/templates/latestupdate'
//# Types //
import { title, titlecompact } from '../../../Shared/types/Data/title'
import { latestupdate } from '../../../Shared/types/Data/latestupdates'
//# Config //
import { grid } from '../../../config/Components/title'
//# Classes //
import './titlesgrid.scss'

type TitlesGrid =
    | { variant: 'card'; data?: title[] }
    | { variant: 'compact'; data?: titlecompact[] }
    | { variant: 'latestupdates'; data?: latestupdate[] }
    | { variant: 'latestupdatescompact'; data?: latestupdate[] }

type TitleItemCompactProps = { variant: 'compact'; title: titlecompact; isLoading: boolean }
type TitleItemCardProps = { variant: 'card'; title: title; isLoading: boolean }
type TitleItemLatestProps = { variant: 'latestupdates', title: latestupdate, isLoading: boolean }
type TitleItemLatestCompactProps = { variant: 'latestupdatescompact', title: latestupdate, isLoading: boolean }

type TitleInfoProps =
    | TitleItemCardProps
    | TitleItemCompactProps
    | TitleItemLatestProps
    | TitleItemLatestCompactProps

// Column-based grid: used by 'compact' and 'latestupdatescompact', which share
// the exact same structure (chunkArray + Array.from(columns).map)
function ColumnsGrid<T>({
    columns,
    frmtdData,
    renderItem
}: {
    columns: number
    frmtdData: T[][]
    renderItem: (item: T, index: number) => React.ReactNode
}) {
    return (
        <>
            {
                Array.from({ length: columns }).map((_, column_i) => (
                    <ul className="titlegrid__list" key={column_i}>
                        {frmtdData[column_i]?.map(renderItem)}
                    </ul>
                ))
            }
        </>
    )
}

function TitleInfo({ title, variant, isLoading }: TitleInfoProps) {
    return (
        isLoading ?
            <section className='titlegrid__item-info-container'>
                {
                    variant === "card"
                        ?
                        <>
                            <PreviewLine width="100%" height={24} />
                            <PreviewLine width="85%" height={18} />
                            <PreviewLine width="100%" height={15} marginTop={"5px"} />
                            <PreviewLine width="100%" height={15} />
                            <PreviewLine width="100%" height={15} />
                            <PreviewLine width="80%" height={15} />
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
                : variant === 'compact' ?
                    <section className='titlegrid__item-info-container'>
                        <Text not_exceed_X={true} className={`titlegrid__item-name`} tag={'h3'}>
                            {title.name}
                        </Text>
                    </section>
                    :
                    (variant === 'latestupdates' || variant === 'latestupdatescompact') ?
                        <section className='titlegrid__item-info-container'>
                            <Text not_exceed_X={true} className={`titlegrid__item-name`} tag={'h3'}>
                                {title.titleName}
                            </Text>
                        </section>
                        :
                        <>
                            INVALID VARIANT 'TitleInfo'
                        </>
    )
}
function TitleArticle({ to, alt, children, src }: { to: string; alt: string; children: React.ReactNode, src: string }) {
    return (
        <Link to={to} className='titlegrid__item__link'>
            <article className='titlegrid__item-article'>
                <Img
                    className={'titlegrid__item-img'}
                    src={src}
                    borderRadius={true}
                    alt={alt}
                />
                {children}
            </article>
        </Link>
    )
}
function TitleItemLatest({ title, variant, isLoading }: TitleItemLatestProps | TitleItemLatestCompactProps) {
    return (
        <li key={title.chapterTranslationId}>
            <TitleArticle to={`/`} alt={`Cover of ${title.titleName}`} src={title.titleImg}>
                <TitleInfo title={title} variant={variant} isLoading={isLoading} />
            </TitleArticle>
        </li>
    )
}
function TitleItem({ title, variant, isLoading }:
    | TitleItemCardProps
    | TitleItemCompactProps
) {
    return (
        <li key={title.id}>
            <TitleArticle to={`/title/${title.id}/${title.name}`} alt={`Cover of ${title.name}`} src={title.img}>
                {
                    variant === 'card'
                        ? <TitleInfo title={title} variant={variant} isLoading={isLoading} />
                        : <TitleInfo title={title} variant={variant} isLoading={isLoading} />
                }
            </TitleArticle>
        </li>
    )
}

export default function TitlesGrid({
    data,
    variant
}: TitlesGrid) {
    const { items, columns } = grid[variant];
    const isLoading = data === undefined

    const wrapperClass = `titlegrid titlegrid--${variant} ${isLoading && 'titlegrid--preview'}`
    const wrapperStyle = { gridTemplateColumns: `repeat(${columns}, 1fr)` }

    if (variant === "compact") {
        const frmtdData = chunkArray(
            data === undefined
                ? Array.from({ length: 20 }, createTitle)
                : data,
            items!
        ).slice(0, columns)

        return (
            <div className={wrapperClass} style={wrapperStyle}>
                <ColumnsGrid
                    columns={columns}
                    frmtdData={frmtdData}
                    renderItem={(title) => (
                        <TitleItem
                            key={title.id}
                            title={title}
                            variant={variant}
                            isLoading={isLoading}
                        />
                    )}
                />
            </div>
        )
    }
    else if (variant === "latestupdatescompact") {
        const frmtdData = chunkArray(
            data === undefined
                ? Array.from({ length: 20 }, createLatestUpdate)
                : data,
            items!
        ).slice(0, columns)

        return (
            <div className={wrapperClass} style={wrapperStyle}>
                <ColumnsGrid
                    columns={columns}
                    frmtdData={frmtdData}
                    renderItem={(title) => (
                        <TitleItemLatest
                            key={title.chapterTranslationId}
                            title={title}
                            variant={variant}
                            isLoading={isLoading}
                        />
                    )}
                />
            </div>
        )
    }
    else if (variant === "card") {
        const frmtdData = data !== undefined ? data : Array.from({ length: 20 }, createTitle)
        return (
            <ul className={wrapperClass} style={wrapperStyle}>
                {
                    frmtdData.map((title) =>
                        <TitleItem
                            key={title.id}
                            title={title}
                            variant={variant}
                            isLoading={isLoading}
                        />
                    )
                }
            </ul>
        )
    }
    else if (variant === "latestupdates") {
        const frmtdData = data !== undefined ? data : Array.from({ length: 20 }, createLatestUpdate)
        return (
            <ul className={wrapperClass} style={wrapperStyle}>
                {
                    frmtdData.map((title) =>
                        <TitleItemLatest
                            key={title.chapterTranslationId}
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