//# Types //
import type { InputsController, SubmitController } from '../types/FormController'
//# Libs //
import { useEffect, useState } from "react";

type config = {
    handleSubmit: (...args: any[]) => Promise<any>
    submitOnChange?: boolean
}

/**
 * **Hook used to manage forms**
 *
 * **It can only be used by one form at a time**
 * 
 * Pass the InputsController onChange function to the input's onChange event, 
 * To manipulate the value written by the user.
 * 
 * In the form submit event, use the onSubmit function provided by SubmitController and pass it to the form’s onSubmit handler.
 * Pass to fetchsubmit (in useFormController) the function responsible for handling the submit. 
 * This function will receive, as an argument, the data object from InputsController.
 * 
 */
export function useFormController(config: config) {
    const { handleSubmit, submitOnChange } = config

    const [data, setData] = useState<{ [key: string]: any }>({})

    const InputsController: InputsController = {
        onChange: onChange,
        changeValue: changeValue,
        data: data,
    }

    //.. Updates the form data when an input changes; toggles values in an array for checkboxes, replaces the value for other input types
    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, type } = event.target

        if (type == 'checkbox') {
            setData(prev => {
                const current = (prev[name] as any[]) || [];

                return {
                    ...prev,
                    [name]: current.includes(value)
                        ? current.filter((v: any) => v !== value)
                        : [...current, value]
                };
            });
        }
        else {
            setData(prev => ({ ...prev, [name]: value }))
        }
    }

    //.. Manually sets the value of a field by name, without needing an input change event
    function changeValue(name: string, value: any) {
        setData(prev => ({ ...prev, [name]: value }))
    }


    const SubmitController: SubmitController = {
        onSubmit: onSubmit,
    }

    //.. Handles the form submit using the handleSubmit function provided to the hook
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        await handleSubmit(InputsController.data)
    }

    //.. Automatically calls handleSubmit ~0.5s after the user stops changing inputs
    useEffect(() => {
        if (!submitOnChange) return
        //.. Debounces the automatic submit by 0.5s so it only fires after the user stops typing
        const timeout = setTimeout(() => {
            handleSubmit(data)
        }, 500)
        return () => clearTimeout(timeout)
    }, [data])

    return { InputsController, SubmitController }
}