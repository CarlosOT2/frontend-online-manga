//# Components //
import Text from '../text'
import Link from '../link'
import Img from '../img'
//# Utils //
import chunkArray from '../../../Shared/utils/chunkArray'
import { staticMapper } from '../../../Shared/utils/staticHandler'
//# Types //
import { title } from '../../../Shared/types/Data/title'
//# Config //
import { grid } from '../../../config/Components/title'
//# Classes //
import './titlesgrid.scss'

type TitlesGrid = {
    data: title[],
    variant: 'card' | 'compact'
}
type TitleInfoConfig = {
    contentRating?: boolean,
    demographic?: boolean,
    genres?: boolean,
    themes?: boolean,
    synopsis?: boolean
}

function TitleInfo({ title, config }: { title: title, config?: TitleInfoConfig }) {
    const { contentRating, demographic, synopsis, genres, themes } = config ?? {}

    return (
        <section className='titlegrid__item-info-container'>
            <Text not_exceed_X={true} className={`titlegrid__item-name`} tag={'h3'}>
                {title.name}
            </Text>
            <ul className='titlegrid__item-list'>
                {contentRating && (
                    <li>
                        <Text no_select={true} not_exceed_X={true} className={`titlegrid__item-contentRating`} tag={'span'}>
                            {staticMapper("contentRatings", Number(title.contentRating))}
                        </Text>
                    </li>
                )}
                {demographic && (
                    <li>
                        <Text no_select={true} not_exceed_X={true} className={`titlegrid__item-demographic`} tag={'span'}>
                            {staticMapper("demographics", Number(title.demographic))}
                        </Text>
                    </li>
                )}
                {genres && (
                    title.genres.map((g, i) =>
                        <li key={`genre-${i}`}>
                            <Text no_select={true} not_exceed_X={true} className={`titlegrid__item-genre`} tag={'span'}>
                                {staticMapper("genres", Number(g))}
                            </Text>
                        </li>
                    )
                )}
                {themes && (
                    title.themes.map((t, i) =>
                        <li key={`genre-${i}`}>
                            <Text no_select={true} not_exceed_X={true} className={`titlegrid__item-theme`} tag={'span'}>
                                {staticMapper("themes", Number(t))}
                            </Text>
                        </li>
                    )
                )}
            </ul>
            {synopsis && (
                <Text tag={'span'} not_exceed_Y={true}>
                    {title.synopsis}
                </Text>
            )}
        </section>
    )
}

function TitleItem({ title, variant }: { title: title, variant: 'card' | 'compact' }) {
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
                        alt={`Cover of ${title.name}`}
                    />
                    {variant === 'compact' && (
                        <TitleInfo title={title} />
                    )}
                    {variant === 'card' && (
                        <TitleInfo title={title} config={{ contentRating: true, demographic: true, genres: true, themes: true, synopsis: true }} />
                    )}
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
    const OrganizedData = chunkArray<title>(data, items).slice(0, columns);

    return (
        variant === "compact"
            ?
            <div
                className={`titlegrid titlegrid--${variant}`}
                style={{
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                }}
            >
                {Array.from({ length: columns }).map((_, column_i) => (
                    <ul className="titlegrid__list" key={column_i}>
                        {OrganizedData[column_i]?.map((title) => (
                            <TitleItem
                                key={title.id}
                                title={title}
                                variant={variant}
                            />
                        ))}
                    </ul>
                ))}
            </div>

            : variant === "card" ?
                <ul
                    className={`titlegrid titlegrid--${variant}`}
                    style={{
                        gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    }}
                >
                    {data.map((title) => (
                        <TitleItem key={`item-${title.id}`} title={title} variant={variant} />
                    ))}
                </ul>
                :
                <>
                    INVALID VARIANT
                </>
    )
}