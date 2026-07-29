//# Components //
import Link from '../Global/link'
import Input from '../Global/Inputs/input'
import Img from '../Global/img'
import TitlesGrid from '../Global/Titles/titlesgrid'
import Text from '../Global/text'
//# Libs //
import { useLocation } from 'react-router'
import { useWindowScroll } from 'react-use'
import { useRef, useEffect } from 'react'
import { useFormController } from '../../Shared/form/FormController'
import { useState } from 'react'
//# Classes //
import './header.scss'
//# Icons //
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoPersonSharp } from "react-icons/io5";
import { GetTitlesByFastFilters } from '../../Shared/api/FetchTitle'
import { fasttitle } from '../../Shared/types/Data/title'

//.. LocalComponents //
function Logo() {
    return (
        <Link to={'/'} defaultStyle={false} ariaLabel={'Go to home'}>
            <Img
                className={'header__logo'}
                src={'/manga-logo.png'}
                alt='logo'
                noPreview={true}
            />
        </Link>
    )
}

export default function Header() {
    const { y } = useWindowScroll()
    const location = useLocation()
    const searchRef = useRef<HTMLDivElement>(null)

    const { InputsController } = useFormController({
        handleSubmit: handleSubmit,
        submitOnChange: true
    })

    const [data, setData] = useState<fasttitle[] | undefined>(undefined)
    const [isEmpty, setIsEmpty] = useState(true)
    const [focusInput, setFocusInput] = useState(false)


    function handleBlur(e: React.FocusEvent) {
        if (searchRef.current?.contains(e.relatedTarget as Node)) return
        setFocusInput(false)
    }
    async function handleSubmit(inputdata: {
        name: string
    }) {
        if (!inputdata.name?.trim()) return

        const res = await GetTitlesByFastFilters(inputdata.name)
        if (res) {
            setData(res)
        }
    }

    useEffect(() => {
        setFocusInput(false)
        setIsEmpty(true)
        setData(undefined)
        InputsController.changeValue('name', '')
    }, [location.pathname])

    return (
        <>
            <header className={`header ${location.pathname === "/" && y === 0 ? 'header--home' : ''}`}>

                <div className={`header__container`}>
                    <nav className={`header__nav`}>
                        <ul>
                            <li>
                                <Logo />
                            </li>
                            <li>
                                <Link to={'/titles/search'} className='header__nav__link'>
                                    SEARCH
                                </Link>
                            </li>
                            <li>
                                <Link to={'/titles/latestupdates'} className='header__nav__link'>
                                    LATEST UPDATES
                                </Link>
                            </li>
                            <li>
                                <Link to={'/titles/recentlyadded'} className='header__nav__link'>
                                    RECENTLY ADDED
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <section className='header__actions'>
                        <section
                            className='header__actions__fast-search'
                            ref={searchRef}
                        >
                            <div
                                className='header__actions__blur'
                                aria-hidden={true}
                                style={{
                                    opacity: focusInput ? '0.5' : '0'
                                }}
                            >
                            </div>
                            <Input
                                type='text'

                                className='header__actions__fast-search-input'
                                divClassName={focusInput ? 'header__actions__fast-search-input--focus' : ''}

                                name='name'
                                InputsController={InputsController}

                                placeHolder='Search'
                                autoComplete='off'
                                Icon={FaMagnifyingGlass}
                                iconClassName={'header__actions__fast-search-icon'}
                                reverseIcon={true}

                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setData(undefined)
                                    setIsEmpty(!e.target.value.trim())
                                }}
                                onFocus={() => setFocusInput(true)}
                                onBlur={handleBlur}
                            />
                            {
                                focusInput &&
                                <section className='header__actions__fast-search-results'>
                                    {
                                        isEmpty ?
                                            <Text tag='span'>Enter a search query...</Text>
                                            : data === undefined ?
                                                <TitlesGrid
                                                    variant='fasttitles'
                                                    data={undefined}
                                                />
                                                : data.length <= 0 ?
                                                    <Text tag='span'>No results found.</Text>
                                                    :
                                                    <TitlesGrid
                                                        variant='fasttitles'
                                                        data={data}
                                                    />
                                    }
                                </section>
                            }
                        </section>

                        <Link className='header__actions__login' >
                            <IoPersonSharp />
                        </Link>
                    </section>
                </div>
            </header>
        </>
    )
}