//# Libs //
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
//# Types //
import type { data, InputsController } from '../types/FormController'

export function useQueryController(InputsController: InputsController) {
    const [searchParams, setSearchParams] = useSearchParams()

    /**
     * Builds a URL query string from the given data object, skipping
     * empty/null/undefined values.
     *
     * @param data - The data object to convert into query params
     * @returns The resulting query string
     */
    function build(data: data): string {
        const params = new URLSearchParams()

        Object.entries(data).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => {
                    params.append(key, String(v))
                })
            } else {
                params.append(key, String(value))
            }
        })

        return params.toString()
    }
    /**
     * Parses the current URL query string back into a data object,
     * grouping repeated keys into arrays.
     *
     * @returns The data object parsed from the current URL
     */
    function parse(): data {
        const result: data = {}
        const uniqueKeys = new Set(searchParams.keys())

        uniqueKeys.forEach(key => {
            result[key] = searchParams.getAll(key)
        })

        return result
    }
    async function handleSubmit(data: data) {
        setSearchParams(build(data))
    }

    //.. Syncs form data (InputsController.data) with the URL query string
    //.. whenever the URL changes (including browser back/forward navigation)
    useEffect(() => {
        const parsedData = parse()
        const array = Object.entries(parsedData)
        if (array.length > 0) {
            array.forEach(([key, value]) => {
                InputsController.changeValue(key, value)
            })
        } else {
            Object.entries(InputsController.data).forEach(([key, value]) => {
                InputsController.changeValue(
                    key,
                    Array.isArray(value) ? [] : ''
                )
            })
        }
    }, [searchParams])

    return { handleSubmit, params: searchParams }
}

