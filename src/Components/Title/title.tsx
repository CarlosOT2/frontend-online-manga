//# Components //
import Text from '../Global/text'
import Button from '../Global/Inputs/button'
import Img from '../Global/img'
//# Libs //
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
//# Services //
import { GetTitleById } from '../../Shared/api/FetchTitle'
//# Utils //
import { staticMapper } from '../../Shared/utils/staticHandler'
//# Types //
import { chapter, title, titlemetakeys } from '../../Shared/types/Data/title'
import { staticDataArray } from '../../Shared/types/Data/static'
//# Config //
import { metanames } from '../../config/Components/title'
//# Classes //
import './title.scss'
//# Icons //
import { FaStar } from "react-icons/fa"
import { IoBook } from "react-icons/io5"
import { TbMessageReportFilled } from "react-icons/tb"
import { LuUpload } from "react-icons/lu"
import { MdOutlineGroup } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";


function Buttons() {
    return (
        <section className='title__header-button-container' role='group'>
            <Button className='title__header-button' icon={<FaStar className='title__header-button-icon' />}>
                <Text className='title__header-button-txt' tag='span' no_select={true}>
                    Favorite
                </Text>
            </Button>
            <Button className='title__header-button' icon={<IoBook className='title__header-button-icon' />}>
                <Text className='title__header-button-txt' tag='span' no_select={true}>
                    Read
                </Text>
            </Button>
            <Button className='title__header-button' icon={<TbMessageReportFilled className='title__header-button-icon' />}>
                <Text className='title__header-button-txt' tag='span' no_select={true}>
                    Report
                </Text>
            </Button>
            <Button className='title__header-button' icon={<LuUpload className='title__header-button-icon' />}>
                <Text className='title__header-button-txt' tag='span' no_select={true}>
                    Upload
                </Text>
            </Button>
        </section>
    )
}

function SectionMeta({ data }: { data: title | undefined }) {
    if (!data) {
        console.warn("Warn: Failed to load section meta content data")
        return
    }

    type metadata = title[keyof title] | undefined
    type groupconfig = {
        name: string,
        data: metadata,
        statickey?: keyof staticDataArray
    }
    const config: groupconfig[] =
        (Object.entries(metanames) as [titlemetakeys, typeof metanames[titlemetakeys]][])
            .map(([key, value]) => ({
                name: value.metaname,
                data: data[key],
                statickey: value.statickey
            }));

    /*
    .. Formats the data into a consistent array structure,
    .. ensuring it's easy to loop through and render on the front end.
    */
    function formatData(raw: metadata) {
        if (Array.isArray(raw)) {
            if (raw.length === 0) return ["None"]
            return raw
        }
        return [raw]
    }

    function Groups({ config }: { config: groupconfig[] }) {
        return config.map((obj, i) => {
            const name = (obj.data && Array.isArray(obj.data) && obj.data.length > 1)
                ? `${obj.name}s`
                : obj.name;
            const formattedData = formatData(obj.data).map(item => {
                if (obj.statickey) {
                    return staticMapper(obj.statickey, Number(item))
                }
                return item
            })

            return (
                <li className="title__meta-list__item" key={`meta_${i}`}>
                    <Text tag="h2" className="title__meta-label">
                        {name}
                    </Text>
                    <ul className="title__meta-inner-list">
                        {
                            formattedData.map((data, data_i) => (
                                <li key={`data_${data_i}`} className='title__meta-inner-list__item'>
                                    <Text tag="span" className='title__meta-inner-list__text'>
                                        {data}
                                    </Text>
                                </li>

                            ))
                        }
                    </ul>
                </li>
            );
        });
    }

    return (
        <div className={'title__meta'}>
            <ul className={'title__meta-list'}>
                <Groups config={config} />
            </ul>
            <Text tag='h2' className='title__meta-label--alternative'>
                Alternative Names
            </Text>
            <ul className={'title__meta-list--alternative'}>
                {Array.from({ length: 10 }).map((_, index) => (
                    <li key={index}>
                        <Img
                            src="/flags/uk.svg"
                            className="title__meta-list--alternative__img"
                            noPreview={true}
                        />
                        <Text tag="span" className="title__meta-list--alternative__text">
                            Warrior Princess Survival Saga: The Unsanctioned Intergender Relations on a Deserted Island, Battling for the Fate of Another World
                        </Text>
                    </li>
                ))}
            </ul>
        </div>

    )
}

function SectionChapters({ data }: { data: title | undefined }) {
    function Item({ chapter }: { chapter: chapter }) {
        const [open, setOpen] = useState(false)
        return (
            <>
                <>
                    <li className={'title__chapters-list__item'} key={chapter.id}>
                        <Button className='title__chapters-list__button' defaultStyle={false} onClick={() => setOpen(!open)}>
                            <Text tag='span' className='title__chapters-list__txt'>
                                Chapter: {chapter.number}
                            </Text>
                        </Button>
                        {open
                            &&
                            <ul className='title__chapters-list--translations'>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <li
                                        key={index}
                                        className='title__chapters-list__item--translations'
                                        style={ index === 4 ? { borderBottom: "0", paddingBottom: "0" } : undefined }
                                    >
                                        <div className='title__chapters-list__item--translations__top'>
                                            <Img
                                                src="/flags/uk.svg"
                                                className="title__chapters-list__item-img"
                                                noPreview={true}
                                            />
                                            <Text tag='span' className='title__chapters-list__item-title' not_exceed_X={true}>
                                                Chapter Title Chapter Title Chapter Title Chapter Title Chapter Title Chapter Title Chapter Title
                                                Chapter Title Chapter Title Chapter Title Chapter Title Chapter Title Chapter Title Chapter Title
                                            </Text>
                                            <IoEyeOutline className='title__chapters-list__item-view-icon' />
                                            <Text tag='span' className='title__chapters-list__item-view'>
                                                5200
                                            </Text>
                                        </div>
                                        <div className='title__chapters-list__item--translations__bottom'>
                                            <MdOutlineGroup className='title__chapters-list__item-scan-icon' />
                                            <Text tag='span' className='title__chapters-list__item-scan' not_exceed_X={true}>
                                                Scan Group Scan Group Scan Group Scan Group Scan Group Scan Group Scan Group Scan Group Scan Group
                                                Scan Group Scan Group Scan Group Scan Group Scan Group Scan Group Scan Group Scan Group Scan Group
                                            </Text>
                                            <Text tag='span' className='title__chapters-list__item-upload'>
                                                50 years ago
                                            </Text>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        }
                    </li>
                </>
            </>
        )
    }
    return (
        <ul className={'title__chapters-list'}>
            {data?.chapters.map((chapter) => (
                <Item chapter={chapter} />
            ))}
        </ul>
    )
}

export default function Title() {

    //.. Variables
    const { id } = useParams();

    //.. States
    const [data, setData] = useState<title>()

    async function req() {
        const res = await GetTitleById(Number(id))
        if (res) setData(res[0])
    }

    useEffect(() => {
        req()
    }, [])



    return (
        <>
            <Text tag='h1' sr_only={true}>
                Title: {data?.name}
            </Text >
            <div className='title__container'>
                <Img
                    className={'title__bg-img'}
                    src={'/manga-teste.jpg'}
                    ariaHidden={true}
                    noPreview={true}
                />
                <header className='title__header'>
                    <Img
                        borderRadius={true}
                        className={'title__header-img'}
                        src={'/manga-teste.jpg'}
                        alt={`Cover of ${data?.name}`}
                    />

                    <section className={'title__header__content'}>
                        <section className='title__header__meta'>
                            <Text className={'title__header__meta-name'} tag='h1' title={true}>
                                {data?.name}
                            </Text>
                            <Text className={'title__header__meta-author'} tag='p'>
                                {data?.authors.join(", ")}
                            </Text>
                        </section>
                        <Buttons />
                    </section>
                </header>
                <article className={'title__content'}>
                    <section className={'title__content__synopsis'}>
                        <Text split_paragraph={'.'} tag='p'>
                            {data?.synopsis}
                        </Text>
                    </section>
                    <hr className='title__content__line' />
                    <section className={'title__content__container'}>
                        <SectionMeta data={data} />
                        <SectionChapters data={data} />
                    </section>
                </article>
            </div>
        </>
    )
}