//# Components //
import FeaturedTitles from '../Global/Titles/featuredtitles'
import Text from '../Global/text'
//# Libs //
import { useState, useEffect } from 'react'
//# Api //
import { GetFeaturedTitles } from '../../Shared/api/FetchTitle'
//# Types //
import { title } from '../../Shared/types/Data/title'
//# Classes //
import './popular.scss'

export default function Popular() {
    const [data, setData] = useState<title[]>([])


    async function req() {
        setData(await GetFeaturedTitles())
    }

    useEffect(() => {
        req()
    }, [])

    return (
        <>
            <div className='home-popular'>
                <FeaturedTitles data={data}/>
            </div>
        </>
    )
}