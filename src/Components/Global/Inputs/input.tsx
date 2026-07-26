//# Utils //
import FilterClasses from '../../../Shared/utils/FilterClasses';
//# Libs //
import { useEffect, useRef } from 'react';
import type { IconType } from 'react-icons';
//# Types //
import type { InputsController } from '../../../Shared/types/FormController';
//# Classes //
import './input.scss';

type InputProps = {
    /** type of the input */
    type: string;
    /** name of the input, used in 'data' from 'FormController' Hook */
    name: string;
    /** additional CSS classes to apply */
    className?: string;
    /** aria-label of the input */
    ariaLabel?: string;
    /** placeholder of the input */
    placeHolder?: string;
    /** fires additionally on input change */
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    /** autocomplete of the input */
    autoComplete?: 'on' | 'off';
    /** add an icon to the input */
    Icon?: IconType;
    /** add a className to the icon */
    iconClassName?: string;
    /** place the input icon on the left instead of the right */
    reverseIcon?: boolean;
    /** controller object containing InputsController from FormController Hook */
    InputsController: InputsController;
};

type DefaultInputProps = Omit<InputProps, 'Icon' | 'iconClassName' | 'reverseIcon'> & { inputRef: React.RefObject<HTMLInputElement | null>}

function DefaultInput({
    type,
    inputRef,
    name,
    className = '',
    ariaLabel,
    autoComplete = 'on',
    InputsController,
    placeHolder,
    onChange,
}: DefaultInputProps) {
    return (
        <input
            ref={inputRef}
            type={type}
            name={name}
            value={InputsController.data[name] ?? ''}
            placeholder={placeHolder}
            className={FilterClasses(`input ${className}`)}
            aria-label={ariaLabel || undefined}
            autoComplete={autoComplete}
            onChange={(event) => {
                InputsController.onChange(event);
                onChange?.(event);
            }}
        />
    );
}

export default function Input({
    Icon,
    reverseIcon,
    iconClassName,
    ...inputProps
}: InputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, [inputProps.InputsController.data[inputProps.name]]);

    const input = <DefaultInput {...inputProps} inputRef={inputRef}/>
   
    if (!Icon) return input
    
    const icon = <Icon className={`input-icon-container-icon ${iconClassName ?? ''}`}/>
  

    return (
        <div className={`input-icon-container ${inputProps.className ?? ''}`}>
            {reverseIcon ? <>{input}{icon}</> : <> {icon}{input}</>}
        </div>
    );
}