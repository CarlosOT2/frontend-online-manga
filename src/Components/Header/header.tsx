//# Components //
import Link from '../Global/link'
import Input from '../Global/Inputs/input'
import Img from '../Global/img'
import TitlesGrid from '../Global/Titles/titlesgrid'
//# Libs //
import { useLocation } from 'react-router'
import { useWindowScroll } from 'react-use'
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
    const { InputsController } = useFormController({
        handleSubmit: handleSubmit,
        submitOnChange: true
    })

    const [data, setData] = useState<fasttitle[] | undefined>(undefined)

    async function handleSubmit(data: {
        name: string
    }) {
        if (!data.name?.trim()) return

        const res = await GetTitlesByFastFilters(data.name)
        if (res) setData(res)
    }


    console.log(data)

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
                        <Input
                            type='text'
                            className='header__actions__fast-search-input'

                            name='name'
                            InputsController={InputsController}

                            placeHolder='Search'
                            autoComplete='off'
                            Icon={FaMagnifyingGlass}
                            iconClassName={'header__actions__fast-search-icon'}
                            reverseIcon={true}
                        />
                        {
                            data &&
                            <>
                            </>
                        }
                        <Link className='header__actions__login' >
                            <IoPersonSharp />
                        </Link>
                    </section>
                </div>
            </header>
        </>
    )
}