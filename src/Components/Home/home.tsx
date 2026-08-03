//# Components //
import Popular from './popular'
import LatestUpdates from './latestupdates'
import RecentlAdded from './recentlyadded'
import Text from '../Global/text'


export default function Home() {
    return (
        <>
            <Text tag='h1' sr_only={true}>
                CatManga — Read Manga Online
            </Text >
            <Popular />
            <RecentlAdded />
            <LatestUpdates />
        </>
    )
}