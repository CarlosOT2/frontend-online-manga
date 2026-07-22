//# Type //
import type { latestupdate } from '../types/Data/latestupdates'

let nextId = 0;

export function createLatestUpdate(): latestupdate {
    return {
        chapterTranslationId: nextId++,
        chapterNumber: "1",

        uploadedAt: '2020-10-22 12:59:08.820831+00',
        viewCount: '1',
        languageId: '1',
        scanGroupName: 'Template',

        titleId: '1',
        titleName: 'Template',
        titleImg: 'Template'
    }
}