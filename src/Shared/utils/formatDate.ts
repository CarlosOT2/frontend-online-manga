//# Libs //
import isDate from "./isDate"

export default function formatDate(dateStr: any) {
    if (!isDate(dateStr)) {
        throw new Error(`formatDate: "${dateStr}" is not a valid date string`)
    }

    const [year, month, day] = dateStr.split('-').map(Number)
    const date = new Date(year, month - 1, day)

    return date.toLocaleDateString(navigator.language, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })
}