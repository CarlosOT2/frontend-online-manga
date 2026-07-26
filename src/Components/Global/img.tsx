//# Libs //
import { useState } from 'react'
//# Utils //
import FilterClasses from '../../Shared/utils/FilterClasses'
//# Classes //
import './img.scss'

type Img = {
    /** src of the image */
    src?: string
    /** additional CSS classes to apply */
    className?: string
    /** disables the loading preview placeholder */
    noPreview?: boolean
    /** renders only the preview placeholder, without loading the actual image */
    onlyPreview?: boolean
    /** apply the className prop to the container div */
    applyClassNameToContainer?: boolean
    /** apply the className prop to the img element */
    applyClassNameToImg?: boolean
    /** apply border-radius style */
    borderRadius?: boolean
    /** alt of the image */
    alt?: string
    /** aria-hidden of the image */
    ariaHidden?: boolean
}

export default function Img({ src, className, alt, borderRadius, noPreview, onlyPreview, ariaHidden = undefined, applyClassNameToContainer = true, applyClassNameToImg = false }: Img) {
    const [loaded, setLoaded] = useState(false)
    return (
        <>
            <div className={FilterClasses(`img__container ${applyClassNameToContainer && className}`)}>
                {!noPreview && !loaded && (
                    <div className={FilterClasses(`img__preview ${borderRadius ? 'img__borderRadius' : ''}`)} />
                )}

                {!onlyPreview && (
                    <img
                        className={FilterClasses(`img ${applyClassNameToImg && className} ${borderRadius ? 'img__borderRadius' : ''}`)}
                        src={src || undefined}
                        alt={alt || undefined}
                        aria-hidden={ariaHidden}
                        loading='lazy'
                        onLoad={() => setLoaded(true)}
                    />
                )}
            </div>
        </>
    )
}