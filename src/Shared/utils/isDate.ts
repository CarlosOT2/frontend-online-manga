export default function isDate(value: any) 
{
    if (typeof value !== 'string') return false
    return /^\d{4}-\d{2}-\d{2}$/.test(value) || /^\d{2}-\d{2}-\d{4}$/.test(value)
}