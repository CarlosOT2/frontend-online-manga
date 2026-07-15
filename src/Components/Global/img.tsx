//# Libs //
import { useState } from 'react'
//# Utils //
import FilterClasses from '../../Shared/utils/FilterClasses'
//# Classes //
import './img.scss'

type Img = {
    /** src of the image */
    src: string
    /** additional CSS classes to apply */
    className?: string
    /** disables the loading preview placeholder */
    noPreview?: boolean
    /** apply border-radius style */
    borderRadius?: boolean
    /** alt of the image */
    alt?: string
    /** aria-hidden of the image */
    ariaHidden?: boolean
}

export default function Img({ src, className, alt, borderRadius, noPreview, ariaHidden = undefined }: Img) {
    const [loaded, setLoaded] = useState(false)
    return (
        <>
            <div className={FilterClasses(`img__container ${className || ''}`)}>
                {!noPreview && !loaded && (
                    <div className={FilterClasses(`img__preview ${borderRadius ? 'img__borderRadius' : ''}`)} />
                )}

                <img
                    className={FilterClasses(`img ${noPreview && className} ${borderRadius ? 'img__borderRadius' : ''}`)}
                    src={src || undefined}
                    alt={alt || undefined}
                    aria-hidden={ariaHidden}
                    loading='lazy'
                    onLoad={() => setLoaded(true)}
                />
            </div>
        </>
    )
}