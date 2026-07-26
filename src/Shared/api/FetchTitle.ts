//# Services //
import PerformFetch from './PerformFetch'
//# Types //
import type { title, titlecompact, fasttitle } from '../types/Data/title'
import type { latestupdate } from '../types/Data/latestupdates'

export async function GetFeaturedTitles(limit: number = 10) {
    return await PerformFetch<title[]>({ url: `/Title/featured?limit=${limit}` })
}

export async function GetLatestUpdatesTitles(limit: number = 20) {
    return await PerformFetch<latestupdate[]>({ url: `/Title/latestupdates?limit=${limit}` })
}

export function GetRecentlyAddedTitles(limit?: number, compact?: true): Promise<titlecompact[]>;
export function GetRecentlyAddedTitles(limit?: number, compact?: false): Promise<title[]>;
export async function GetRecentlyAddedTitles(limit: number = 20, compact: boolean = true) {
    return await PerformFetch<title[] | titlecompact[]>({
        url: `/Title/recentlyadded?limit=${limit}&compact=${compact}`
    });
}

export async function GetTitleById(id: number) {
    return await PerformFetch<title[]>({ url: `/Title?id=${id}` })
}

export async function GetTitlesByFastFilters(name: string) {
    return await PerformFetch<fasttitle[]>({
        url: `/Title/search/fast?name=${name}`
    });
}
export async function GetTitlesByFilters(data: {
    name?: string,
    author?: string,
    artist?: string,

    genresIds?: number[] | string[],
    themesIds?: number[] | string[],
    statusIds?: number[] | string[],
    demographicIds?: number[] | string[],
    contentRatingIds?: number[] | string[],
    publicationYear?: number | string,

    excludeGenresIds?: number[] | string[],
    excludeThemesIds?: number[] | string[]
}) {

    const params = new URLSearchParams()
    Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return

        if (Array.isArray(value)) {
            value.forEach(v => params.append(key, String(v)))
        } else {
            params.append(key, String(value))
        }
    })
    const query = params.toString()
    return await PerformFetch<title[]>({ url: `/Title/search?${query}` })
}
