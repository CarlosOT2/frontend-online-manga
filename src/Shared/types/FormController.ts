export type data = Record<string, any>

export type InputsController = {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    changeValue: (name: string, value: any) => void,
    data: data
}

export type SubmitController = {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>
}