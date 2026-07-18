//# Types //
import { titlemetakeys } from '../../Shared/types/Data/title'
import { staticDataArray } from '../../Shared/types/Data/static'

type titlemetanames = Record<titlemetakeys, { metaname: string; statickey?: keyof staticDataArray }>
type titlegrid = { [keyof: string]: { columns: number, items?: number } }

/**
 * Mapping of which title metadata fields will be displayed in the `title` route.
 *
 * Each key corresponds to a property on the title object returned by the API.
 * The value defines how that property should be displayed:
 *
 *  - If the object contains only `metaname` (e.g., "Author", "Artist"):
 *      → The field already comes as plain text from the API, so no conversion is required.
 *      → The `metaname` field defines the label that will be displayed for that metadata field.
 *
 *  - If the object contains `{ metaname, statickey }`:
 *      → The title property contains IDs.
 *      → `statickey` points to a group inside `staticDataArray`, which represents the static data returned by 
 *      the API and is used to convert those IDs into human-readable names.
 *      → The `metaname` field defines the label that will be displayed for that metadata field.
 *
 * In summary:
 *  - This config controls which fields from `title` are shown to the user.
 *  - When necessary, it converts IDs from the title into readable strings using static data.
 *  - It allows customizing labels and linking each type of metadata to its corresponding static dataset.
 */
const metanames: titlemetanames = {
    authors: {
        metaname: 'Author'
    },
    artists: {
        metaname: 'Artist'
    },
    genres: {
        metaname: 'Genre',
        statickey: 'genres'
    },
    themes: {
        metaname: "Theme",
        statickey: 'themes'
    },
    contentRating: {
        metaname: "Content Rating",
        statickey: "contentRatings"
    },
    demographic: {
        metaname: "Demographic",
        statickey: "demographics"
    },
    status: {
        metaname: "Status",
        statickey: "statuses"
    }
};

/**
 * **Grid configuration for the TitleGrid component.**
 *
 * Each key represents a grid variant.
 *
 * Properties:
 * - `columns`: Number of columns displayed by the grid.
 * - `items` (compact only): Maximum number of items displayed in each column.
 */
const grid: titlegrid = {
    compact: {
        columns: 4,
        items: 5
    },
    card: {
        columns: 2,
    }
}

export { metanames, grid };