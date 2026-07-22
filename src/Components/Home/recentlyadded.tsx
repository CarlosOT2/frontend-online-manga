//# Components //
import Text from '../Global/text'
import TitleGrid from '../Global/Titles/titlesgrid'
//# Libs //
import { useState, useEffect } from 'react'
//# Api //
import { GetRecentlyAddedTitles, } from '../../Shared/api/FetchTitle'
//# Types //
import { titlecompact } from '../../Shared/types/Data/title'
//# Classes //
import './recentlyadded.scss'

export default function RecentlyAdded() {
    const [data, setData] = useState<titlecompact[] | undefined>(undefined)

    async function req() {
        setData(await GetRecentlyAddedTitles())
    }

    useEffect(() => {
        req()
    }, [])

    return (
        <div className='recentlyadded' >
            <section className='recentlyadded__section' >
                <Text tag='h2' title={true} >
                    Recently Added
                </Text>
                <TitleGrid data={data} variant='compact' />
            </section>
        </div>
    )
}