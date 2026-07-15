import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFilter, submitSoListingData } from '../../reducers/features/listing/soListing'
import toast from 'react-hot-toast'


const SideBar = ({ sidebarOpen, setSidebarOpen }) => {
    const dispatch = useDispatch()
    const location = useSelector((state) => state.locationCoordinates.currLocation)
    const filteredProducts = useSelector((state) => state.soListing?.soListing)

    const filters = useSelector(state => state.soListing.filter);

    const handlePrice = (e) => {
        dispatch(
            setFilter({
                price: Number(e.target.value)
            })
        );
    }
    useEffect(() => {
        if (!location) return;

        dispatch(
            setFilter({
                longitude: location.lng,
                latitude: location.lat,
            })
        );
    }, [location, dispatch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(submitSoListingData({ ...filters }));
        }, 400);

        return () => clearTimeout(timer);
    }, [filters, dispatch]);

    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        if (filters.category === "All listings") {
            setAllProducts(filteredProducts);
        }
    }, [filteredProducts, filters.category]);

    const categoryCount = allProducts?.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
    }, {});

    const categories = [
        { id: 'C1', name: 'All listings', quantity: allProducts?.length || 0 },
        { id: 'C2', name: 'Electronics', quantity: categoryCount?.Electronics || 0 },
        { id: 'C3', name: 'Furniture', quantity: categoryCount?.Furniture || 0 },
        { id: 'C4', name: 'Clothing', quantity: categoryCount?.Clothing || 0 },
        { id: 'C5', name: 'Books', quantity: categoryCount?.Books || 0 },
        { id: 'C6', name: 'Vehicles', quantity: categoryCount?.Vehicles || 0 },
        { id: 'C7', name: 'Sports', quantity: categoryCount?.Sports || 0 },
        { id: 'C8', name: 'Kitchen', quantity: categoryCount?.Kitchen || 0 },
    ]

    const raduis = [
        { id: 'R1', distance: 1 },
        { id: 'R2', distance: 2 },
        { id: 'R3', distance: 5 },
        { id: 'R4', distance: 10 },
        { id: 'R5', distance: 20 },
    ]

    const conditions = [
        { id: 'CO1', condition: 'New' },
        { id: 'CO2', condition: 'Like new' },
        { id: 'CO3', condition: 'Good' },
        { id: 'CO4', condition: 'Fair' },
        { id: 'CO5', condition: 'For parts' },
    ]

    const resetFilter = () => {
        toast.success('Filter reset');
        dispatch(setFilter({
            category: "All listings",
            condition: "",
            latitude: location?.lat,
            longitude: location?.lng,
            price: 100000,
            radius: 5,
            search: "",
        }))
    }

    return (
        <>
            <div onClick={() => setSidebarOpen(false)} className={`fixed inset-0 bg-black/40 z-10 transition-opacity duration-300 lg:hidden ${sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} />

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 z-10 w-full sm:w-65 lg:w-65 lg:h-190 md:h-full sm:h-full max-sm:h-full border-r border-border overflow-y-auto transform transition-transform duration-300 bg-white text-black dark:bg-gray-900 dark:text-white ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:z-auto lg:h-full lg:w-65 lg:translate-x-0  `} >


                <div className='p-4 lg:h-190 md:h-full sm:h-full max-sm:h-full overflow-y-auto'>

                    <div className='text-right'>
                        <button onClick={() => setSidebarOpen(false)} className='cursor-pointer lg:hidden '> ✕ </button>
                    </div>

                    {/* categories  */}
                    <div className='mb-2'>
                        <span className='text-gray-500 text-h5 font-semibold'>CATEGORIES</span>
                        <div className='mt-1 mb-1 '>
                            {
                                categories.map((item) => (
                                    <div key={item.id} onClick={() => {
                                        dispatch(
                                            setFilter({
                                                category: item.name
                                            })
                                        )
                                    }}
                                        className={`flex justify-between items-center hover:bg-secondary hover:text-text-dark rounded-xl cursor-pointer mt-1 pt-1 pr-3 pb-1 pl-8 ${filters.category === item.name ? 'bg-secondary text-text-dark' : null} `}>
                                        <span className='text-h2 '>{item.name}</span>
                                        <span className='text-gray-500 text-h4'>{item.quantity}</span>
                                    </div>
                                ))
                            }

                        </div>
                    </div>

                    {/* price range */}
                    <div className='mt-1 mb-2'>
                        <span className='text-gray-500 text-h5 font-semibold'>PRICE RANGE</span>
                        <div className='text-h4 mt-1'>
                            <div className='flex justify-between text-gray-500'>
                                <span>₹0</span>
                                <span>₹100,000</span>
                            </div>

                            {/* slider */}
                            <input type="range" min="0" max="50000" value={filters.price} onChange={handlePrice} style={{
                                background: `linear-gradient( to right, #1D9E75 0%, #1D9E75 ${(filters.price / 50000) * 100}%, #E1F5EE ${(filters.price / 50000) * 100}%, #E1F5EE 100%)`,
                            }}
                                className="w-full appearance-none h-1 rounded-xl cursor-pointer [&::-webkit-slider-runnable-track]:h-1  [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5  [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-xl [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:mt-[-5px] " />
                            <div className='text-gray-500'>Up to ₹ {filters.price}</div>
                        </div>
                    </div>

                    {/* radius */}
                    <div className='mt-1 mb-2'>
                        <span className='text-gray-500 text-h5 font-semibold'>RADIUS</span>
                        <div className='flex flex-wrap mt-1 gap-1.5'>
                            {
                                raduis.map((dis) => (
                                    <button onClick={() => {
                                        dispatch(
                                            setFilter({
                                                radius: dis.distance
                                            })
                                        );
                                    }}
                                        key={dis.id} className={`text-h4 border border-border hover:bg-black hover:text-white rounded-xl cursor-pointer hover:border-black dark:hover:bg-white dark:hover:text-black pt-1 pr-2.5 pb-1 pl-2.5 ${filters.radius === dis.distance ? 'bg-black text-white dark:bg-white dark:text-black' : null} `}>{dis.distance} km</button>
                                ))
                            }
                        </div>
                    </div>

                    {/* condition */}
                    <div className='mt-1 mb-2'>
                        <span className='text-gray-500 text-h5 font-semibold'>CONDITION</span>
                        <div className='text-h2 mt-1'>
                            {
                                conditions.map((con) => (
                                    <div key={con.id} className='flex items-center gap-2'>
                                        <input onChange={() => {
                                            dispatch(
                                                setFilter({
                                                    condition: con.condition
                                                })
                                            )
                                        }} checked={filters.condition == con.condition} className={`${filters.condition == con.condition ? 'accent-primary' : null} `} id={con.id} type='checkbox' />
                                        <label onClick={() => {
                                            dispatch(
                                                setFilter({
                                                    condition: con.condition
                                                })
                                            )
                                        }} className='cursor-pointer' htmlFor={con.id}>{con.condition}</label>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div onClick={resetFilter} className='bg-primary text-white text-h2 font-medium font-stretch-130% text-center rounded-xl cursor-pointer mt-4 pt-3 pb-3'>
                        <button className='cursor-pointer'>Reset filter</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SideBar
