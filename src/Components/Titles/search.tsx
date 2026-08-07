//# Components //
import Text from '../Global/text'
import Input from '../Global/Inputs/input'
import Button from '../Global/Inputs/button'
import CheckBoxInput from '../Global/Inputs/checkboxinput'
import TitleGrid from '../Global/Titles/titlesgrid'
//# Libs //
import { useState, useEffect, useId } from 'react'
import FilterClasses from '../../Shared/utils/FilterClasses'
import isPlainObject from '../../Shared/utils/isPlainObject'
import { staticMapper, getAllStaticKeys } from '../../Shared/utils/staticHandler'
//# Api //
import { GetTitlesByFilters, GetRecentlyAddedTitles } from '../../Shared/api/FetchTitle'
//# Services //
import { GetAllStatic } from '../../Shared/api/FetchStatic'
//# Utils //
import { useFormController } from '../../Shared/form/FormController'
import { useQueryController } from '../../Shared/form/QueryController'
//# Types //
import { staticData, staticDataArray } from '../../Shared/types/Data/static'
import { title } from '../../Shared/types/Data/title'
import type { InputsController } from '../../Shared/types/FormController'
//# Classes //
import './search.scss'
//# Icons //
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineUnfoldMore } from "react-icons/md";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

//.. Local Types // 
type state = {
    showFilterItem: string | null,
    setShowFilterItem: React.Dispatch<React.SetStateAction<string | null>>
}

type Faceted = {
    type: 'faceted';
    inputname: { [key: string]: string };
    label: string;
    options: Record<string, staticData[]>;
    state: state;
    InputsController: InputsController;
}

type MultiDropDown = {
    type: 'multidropdown';
    label: string;
    inputname: string;
    options: staticData[];
    state: state;
    InputsController: InputsController;
}

type SelectText = {
    type: 'selecttext';
    label: string;
    inputname: string;
    options?: undefined;
    state: state;
    InputsController: InputsController;
}

type SearchNumber = {
    type: 'searchnumber';
    label: string;
    inputname: string;
    options?: undefined;
    state: state;
    InputsController: InputsController;
}

//.. Local Components //
function FilterItem({ type, label, options, state, inputname, InputsController }: Faceted | MultiDropDown | SelectText | SearchNumber) {
    const id = `label_${useId()}`

    const { showFilterItem, setShowFilterItem } = state

    // Default suffix used to access exclusion InputsData
    const excludeTextString = 'exclude'

    return (
        <>
            <div className='search__filters-item'>
                <h3 id={id}>
                    {label}
                </h3>
                <Button
                    onClick={() => {
                        if (label !== showFilterItem) {
                            setShowFilterItem(label)
                        }
                        else {
                            setShowFilterItem(null)
                        }
                    }}
                    icon={<MdOutlineUnfoldMore size={20} />}
                    ariaLabelledBy={id}
                    defaultStyle={false}
                    className='search__filters-button'
                >
                    <Text tag='span' no_select={true} not_exceed_X={true}>
                        {
                            (() => {


                                // MultiDropDown
                                const mddValue = InputsController.data[inputname as string];
                                if (Array.isArray(mddValue) && mddValue.length > 0 && Array.isArray(options)) {
                                    return mddValue
                                        .map(v => options.find((obj: staticData) => obj.id === Number(v))?.name)
                                        .join(", ");
                                }

                                // SelectText & SelectNumber
                                const slctValue = InputsController.data[inputname as string];
                                if ((typeof slctValue === "string" || typeof slctValue === "number") && !options) {
                                    return slctValue.toString() || "None";
                                }

                                // Faceted
                                if (isPlainObject(options) && Object.values(options).every(Array.isArray)) {
                                    const optionsKeys = Object.keys(options);
                                    const staticKeys = getAllStaticKeys()
                                    const facetedInputname = inputname as { [key: string]: string }

                                    const values = optionsKeys.flatMap((key) => {
                                        const frmtdKey = key.toLowerCase() as keyof staticDataArray

                                        if (!staticKeys.includes(frmtdKey)) {
                                            console.error(`Invalid key "${key}". Cannot format value because it does not exist in data returned by GetAllStatic().`)
                                            return []
                                        }

                                        const keyValues = InputsController.data[`${facetedInputname[key]}`] ?? []

                                        return [
                                            ...keyValues.map((value: string) =>
                                                staticMapper(frmtdKey, Number(value))
                                            )
                                        ]
                                    })

                                    if (values.length > 0) return values.join(", ")
                                }

                                return "None";
                            })()
                        }
                    </Text>
                </Button>
                {showFilterItem === label && (
                    <div
                        className={FilterClasses(`
                        search__filters-item__options
                        ${type === "faceted" ? "search__filters-item__options--faceted" : ""}
                        ${type === "multidropdown" ? "search__filters-item__options--multidropdown" : ""}
                        ${type === "selecttext" ? "search__filters-item__options--selecttext" : ""}
                        ${type === "searchnumber" ? "search__filters-item__options--searchnumber" : ""}
                        `)}
                    >
                        {
                            type === "faceted" ?
                                Object.entries(options).map(([key, value]) => (
                                    <section key={key}>
                                        <Text tag='h4'>
                                            {key}
                                            <div className='search__filters-item__options__title-line' aria-hidden={true}></div>
                                        </Text>

                                        <ul>
                                            {value.map(function (option) {
                                                const dataIncludeKey = `${(inputname as { [key: string]: string })[key]}`
                                                const dataExcludeKey = `${excludeTextString}${(inputname as { [key: string]: string })[key]}`

                                                const isInclude = (InputsController.data[dataIncludeKey] ?? []).includes(String(option.id))
                                                const isExclude = (InputsController.data[dataExcludeKey] ?? []).includes(String(option.id))

                                                return (
                                                    <li key={option.name}>
                                                        <CheckBoxInput
                                                            value={option.id}
                                                            label={option.name}
                                                            disableOnChange={true}
                                                            classNameLabel={
                                                                `
                                                                search__filters-item__options--faceted-label
                                                                ${isExclude ?
                                                                    `search__filters-item__options--faceted-label-exclude`
                                                                    : isInclude ?
                                                                        `search__filters-item__options--faceted-label-include`
                                                                        : ''
                                                                }
                                                                `
                                                            }
                                                            name={`${inputname}_${key}`}
                                                            onClick={() => {
                                                                const filterById = (list: string[], id: number) =>
                                                                    (list ?? []).filter((item) => Number(item) !== id)

                                                                const id = String(option.id)
                                                                const includes = InputsController.data[dataIncludeKey] ?? []
                                                                const excludes = InputsController.data[dataExcludeKey] ?? []

                                                                if (isInclude) {
                                                                    // include → exclude
                                                                    InputsController.changeValue(dataIncludeKey, filterById(includes, option.id))
                                                                    InputsController.changeValue(dataExcludeKey, [...excludes, id])
                                                                } else if (isExclude) {
                                                                    // exclude → none
                                                                    InputsController.changeValue(dataIncludeKey, filterById(includes, option.id))
                                                                    InputsController.changeValue(dataExcludeKey, filterById(excludes, option.id))
                                                                } else {
                                                                    // none → include
                                                                    InputsController.changeValue(dataIncludeKey, [...includes, id])
                                                                }
                                                            }}
                                                            InputsController={InputsController}
                                                        />
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </section>
                                ))
                                : type === "multidropdown" ?
                                    <ul>
                                        {
                                            options.map(option => (
                                                <li key={option.name}>
                                                    <CheckBoxInput
                                                        value={option.id}
                                                        label={option.name}
                                                        name={`${inputname}`}
                                                        InputsController={InputsController}
                                                    />
                                                </li>
                                            ))
                                        }
                                    </ul>
                                    : type == "selecttext" ?
                                        <>
                                            <Input
                                                type='text'
                                                className='search__filters-item__options__input'
                                                Icon={HiMiniMagnifyingGlass}
                                                name={inputname}
                                                autoComplete='off'
                                                InputsController={InputsController}
                                            />
                                        </>
                                        : type == "searchnumber" ?
                                            <>
                                                <Input
                                                    type='number'
                                                    className='search__filters-item__options__input'
                                                    name={inputname}
                                                    autoComplete='off'
                                                    InputsController={InputsController}
                                                />
                                            </>
                                            :
                                            <span>Invalid filter type</span>

                        }
                    </div>
                )}
            </div >
        </>
    )
}

export default function Search() {
    const { InputsController, SubmitController } = useFormController({
        handleSubmit: handleSubmit
    })
    const QueryController = useQueryController(InputsController)

    const [data, setData] = useState<title[]>()
    const [staticData, setStaticData] = useState<staticDataArray>({} as staticDataArray)

    const [showFilterItem, setShowFilterItem] = useState<string | null>(null)
    const [showFilters, setShowFilters] = useState(false)

    async function handleSubmit(data: {
        name: string,
        author: string,
        artist: string,

        contentRatingIds: string[],
        demographicIds: string[],
        statusIds: string[],
        publicationYear: string,

        genresIds: string[],
        themesIds: string[],

        excludeGenresIds: string[],
        excludeThemesIds: string[]
    }) {
        QueryController.handleSubmit(data)
    }


    //.. Get static data from the database
    useEffect(() => {
        GetAllStatic().then(setStaticData)
    }, [])

    //.. Loads the initial list of titles when the page opens/reload 
    //.. Re-fetches results whenever the URL query string changes
    useEffect(() => {
        const query = QueryController.params.toString()
        GetTitlesByFilters(query).then(res => {
            if (res) setData(res)
        })
    }, [QueryController.params])

    //.. Resets the selected filter tab
    useEffect(() => {
        setShowFilterItem(null)
    }, [showFilters])

    return (
        <div className='search'>
            <form
                className='search__form'
                onSubmit={SubmitController.onSubmit}
            >
                <section className='search__form-inputs'>
                    <Input
                        type='text'
                        className='search__form-inputs__input'
                        Icon={HiMiniMagnifyingGlass}
                        name='name'
                        autoComplete='off'
                        InputsController={InputsController}
                    />
                    <Button
                        onClick={() => { setShowFilters(!showFilters) }}
                        className='search__form-inputs__button-filter'
                    >
                        <IoIosArrowDown size={20} color='var(--color1)' />
                        <Text tag='span'>
                            {showFilters ? 'Hide' : 'Show'} Filters
                        </Text>
                    </Button>
                    <Button
                        type={'submit'}
                        className='search__form-inputs__button-submit'
                    >
                        <HiMiniMagnifyingGlass size={20} color='var(--color1)' />
                        <Text tag='span'>
                            Search
                        </Text>
                    </Button>
                </section>
                {showFilters && (
                    <>
                        <section className='search__filters'>
                            <FilterItem
                                type={"faceted"}
                                inputname={{ themes: "ThemesIds", genres: "GenresIds" }}
                                label="Tags"
                                options={{ themes: staticData.themes, genres: staticData.genres }}
                                state={{ showFilterItem, setShowFilterItem }}
                                InputsController={InputsController}
                            />
                            <FilterItem
                                type={"multidropdown"}
                                inputname={'contentRatingIds'}
                                label="Content Rating"
                                options={staticData.contentRatings}
                                state={{ showFilterItem, setShowFilterItem }}
                                InputsController={InputsController}
                            />
                            <FilterItem
                                type={"multidropdown"}
                                inputname={'demographicIds'}
                                label="Demographic"
                                options={staticData.demographics}
                                state={{ showFilterItem, setShowFilterItem }}
                                InputsController={InputsController}
                            />
                            <FilterItem
                                type={"multidropdown"}
                                inputname={'statusIds'}
                                label="Status"
                                options={staticData.statuses}
                                state={{ showFilterItem, setShowFilterItem }}
                                InputsController={InputsController}
                            />
                            <FilterItem
                                type={"selecttext"}
                                label="Author"
                                inputname={'author'}
                                state={{ showFilterItem, setShowFilterItem }}
                                InputsController={InputsController}
                            />
                            <FilterItem
                                type={"selecttext"}
                                label="Artist"
                                inputname={'artist'}
                                state={{ showFilterItem, setShowFilterItem }}
                                InputsController={InputsController}
                            />
                            <FilterItem
                                type={"searchnumber"}
                                label="Publication Year"
                                inputname={'publicationYear'}
                                state={{ showFilterItem, setShowFilterItem }}
                                InputsController={InputsController}
                            />
                        </section>
                    </>
                )}
            </form>

            <section className='search__result'>
                <Text tag='h3' title={true} sr_only={true}>
                    Results
                </Text>
                <TitleGrid data={data} variant={'card'} />
            </section>
        </div >
    )
}