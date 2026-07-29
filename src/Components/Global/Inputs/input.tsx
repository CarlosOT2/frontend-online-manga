//# Utils //
import FilterClasses from '../../../Shared/utils/FilterClasses';
//# Libs //
import { useRef } from 'react';
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
    /** CSS classes for the input's wrapper `<div>` */
    divClassName?: string;
    /** aria-label of the input */
    ariaLabel?: string;
    /** style of the input */
    style?: React.CSSProperties;
    /** placeholder of the input */
    placeHolder?: string;
    /** fires additionally on input change */
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    /** onBlur event of the input */
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** onFocus event of the input */
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void; 
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
    onFocus,
    style,
    onBlur,
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
            onBlur={onBlur}
            onFocus={onFocus}
            style={style}
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
    divClassName,
    ...inputProps
}: InputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const input = <DefaultInput {...inputProps} inputRef={inputRef}/>
   
    if (!Icon) return input
    
    const icon = <Icon className={`input-icon-container-icon ${iconClassName ?? ''}`}/>
  

    return (
        <div className={`input-icon-container ${divClassName} ${inputProps.className ?? ''}`}>
            {reverseIcon ? <>{input}{icon}</> : <> {icon}{input}</>}
        </div>
    );
}