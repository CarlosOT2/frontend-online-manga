//# Types //
import { ReactNode, SelectHTMLAttributes } from "react";
//# Classes //
import './selectinput.scss'

interface selectinput extends SelectHTMLAttributes<HTMLSelectElement> {
    /** Options rendered inside the select */
    children: ReactNode
}

export default function selectinput({ children, ...props }: selectinput) {
    return (
        <select {...props}>
            {children}
        </select>
    )
}