//# Components //
import FeaturedTitles from '../Global/Titles/featuredtitles'
//# Libs //
import { useState, useEffect } from 'react'
//# Api //
import { GetFeaturedTitles } from '../../Shared/api/FetchTitle'
//# Types //
import { title } from '../../Shared/types/Data/title'
//# Classes //
import './popular.scss'

export default function Popular() {
    const [data, setData] = useState<title[] | undefined>(undefined)


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