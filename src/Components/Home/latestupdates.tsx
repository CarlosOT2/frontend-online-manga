//# Components //
import Text from '../Global/text'
import TitleGrid from '../Global/Titles/titlesgrid'
//# Libs //
import { useState, useEffect } from 'react'
//# Api //
import { GetLatestUpdatesTitles } from '../../Shared/api/FetchTitle'
//# Types //
import { latestupdate } from '../../Shared/types/Data/latestupdates'
//# Classes //
import './latestupdates.scss'

export default function LatestUpdates() {
    const [data, setData] = useState<latestupdate[] | undefined>(undefined)

    async function req() {
        setData(await GetLatestUpdatesTitles())
    }

    useEffect(() => {
        req()
    }, [])

    return (
        <div className='latestupdates'>

            <section className='latestupdates__section'>
                <Text tag='h2' title={true}>
                    Latest Updates
                </Text>
                <TitleGrid data={data} variant='latestupdatescompact' />
            </section>
        </div>
    )
}