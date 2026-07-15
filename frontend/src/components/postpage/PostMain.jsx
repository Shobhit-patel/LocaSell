import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addImage, setProductInfo } from '../../reducers/features/uploadedProdSlice'
import { setOpen } from '../../reducers/features/popup/mapPopup'
import toast from 'react-hot-toast'

const PostMain = ({ setSidebarOpen }) => {
    const categories = [
        { id: 'C2', name: 'Electronics' },
        { id: 'C3', name: 'Furniture' },
        { id: 'C4', name: 'Clothing' },
        { id: 'C5', name: 'Books' },
        { id: 'C6', name: 'Vehicles' },
        { id: 'C7', name: 'Sports' },
        { id: 'C8', name: 'Kitchen' },
    ]

    const conditions = [
        { id: 'CO1', condition: 'New' },
        { id: 'CO2', condition: 'Like new' },
        { id: 'CO3', condition: 'Good' },
        { id: 'CO4', condition: 'Fair' },
        { id: 'CO5', condition: 'For parts' },
    ]

    // to active category and conditiont button
    const dispatch = useDispatch()

    const [categoriesActive, setCategoriesActive] = useState('')
    const [conditionsActive, setconditionsActive] = useState('')

    const location = useSelector((state) => state.locationCoordinates.currLocation)
    const locName = useSelector((state) => state.location.currLocationName)
    const soMainLocName = locName.split(',')[0]


    const [preview, setPreview] = useState([])

    const [postInfo, setPostInfo] = useState({
        image: [],
        name: '',
        description: '',
        price: '',
        location: {
            type: "Point",
            coordinates: []
        },
        brand: '',
        model: '',
        product_age: '',
        original_price: '',
        category: '',
        condition: '',
    })

    const handleChange = (e) => {
        setPostInfo({ ...postInfo, [e.target.name]: e.target.value })
    }

    const selectCategory = (category) => {
        setPostInfo({ ...postInfo, category: category })
    }

    const selectCondition = (condition) => {
        setPostInfo({ ...postInfo, condition: condition })
    }

    const maxFileSize = 2 * 1024 * 1024;

    const [error, setError] = useState('');

    const selectImage = async (e) => {
        const file = e.target.files[0];

        if (!file) return;
        if (preview.length >= 4) {
            toast.success('Maximum 4 images allowed')
            return;
        }
        if (file.size > maxFileSize) {
            toast.error('File is too large. Maximum allowed size is 2MB')
            event.target.value = '';
            return;
        }

        setError('');
        setPostInfo(prev => ({
            ...prev,
            image: [...prev.image, file]
        }));

        const previewUrl = URL.createObjectURL(file);
        setPreview(prev => [
            ...prev,
            previewUrl
        ]);

    };  

    const removeImage = (indexToRemove) => {
        setPreview(prev =>
            prev.filter((_, index) => index !== indexToRemove)
        );

        setPostInfo(prev => ({
            ...prev,
            image: prev.image.filter((_, index) => index !== indexToRemove)
        }));
    };

    useEffect(() => {
        dispatch(setProductInfo(postInfo))
        dispatch(addImage(preview))
    }, [postInfo, dispatch])

    useEffect(() => {
        setPostInfo({
            ...postInfo, location: {
                type: "Point",
                coordinates: [
                    location.lng,
                    location.lat
                ]
            }
        })
    }, [location])

    return (
        <>
            <div className='flex-1 p-5 lg:h-[calc(100vh_-_120px)] md:h-[calc(100vh_-_175px)] min-sm:h-[calc(100vh_-_220px)] h-[calc(100vh_-_220px)] mt-0 overflow-y-auto'>
                <button className=' block lg:hidden w-full text-right mb-3'>
                    <img onClick={() => setSidebarOpen(true)} className='w-5 inline-block cursor-pointer dark:invert-100' src="../../../src/assets/icons/hamburger.png" alt="" />
                </button>


                <div>
                    <label className='flex flex-col text-center text-gray-500 rounded-xl cursor-pointer pt-13 pb-13 border border-gray-400 border-dashed h-40 hover:border-primary hover:bg-secondary' htmlFor="files">
                        <span className='text-h2'>Drag photos here or click to upload (up to 4)</span>
                        <span className='text-h4'>JPG, PNG — Uploaded via Cloudinary</span>
                        <input onChange={selectImage} id='files' className='hidden' multiple type="file" accept='image/*' />
                    </label>
                    <h1 className='text-h1 text-red-500'>{error}</h1>
                </div>

                {/* image uploaded */}
                <div className='flex gap-2.5 mt-4'>
                    {
                        preview.map((img, key) => (
                            <div key={key} className='flex justify-center items-center relative bg-gray-100 border border-border w-20 h-20  rounded-xl '>
                                <img className='h-19.5 rounded-xl' src={img} alt="preview" />
                                <img onClick={() => removeImage(key)} className='absolute w-4 h-4 bg-red-400 p-0.5 -right-1.5 -top-1.5 rounded-full cursor-pointer' src="../../../src/assets/icons/close.png" alt="cross" />
                            </div>
                        ))
                    }
                    {
                        preview.length < 4 ?
                            <div >
                                <label className='border border-border border-dashed flex justify-center items-center text-gray-500 w-20 h-20 rounded-xl cursor-pointer' htmlFor="files">
                                    +
                                    <input onChange={selectImage} id='files' className='hidden' multiple type="file" accept='image/*' />
                                </label>
                            </div>
                            :
                            null
                    }
                </div>

                {/* item title */}
                <div className='grid mt-3.5'>
                    <span className='text-h4 font-medium text-gray-500'>Item title</span>
                    <input className='text-h2 border border-border rounded-xl mt-1 pt-2 pb-2 pl-3 outline-0 ' type="text" placeholder='enter product name' name='name' value={postInfo.name} onChange={handleChange} />
                </div>

                {/* item description */}
                <div className='grid mt-3.5'>
                    <span className='text-h4 font-medium text-gray-500'>Description</span>
                    <textarea className='text-h2 border border-border outline-0 rounded-xl resize-none h-20 mt-1 pt-2 pb-2 pl-3' placeholder="Describe your item — include brand, age, reason for selling, what's included..." name='description' value={postInfo.description} onChange={handleChange}></textarea>
                </div>

                {/* price and location */}
                <div className='flex flex-col md:flex-row gap-3 '>
                    <div className='grid w-full mt-3.5'>
                        <span className='text-h4 font-medium text-gray-500'>Price</span>
                        <div className='flex items-center border border-border mt-1 text-h2 rounded-xl'>
                            <span className='text-gray-500 border-r border-border py-2 px-3 cursor-pointer'>₹</span>
                            <input className='py-2 px-3 w-full outline-0 [appearance-textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' type="number" placeholder='enter product price' name='price' value={postInfo.price} onChange={handleChange} />
                        </div>
                    </div>

                    <div className='grid w-full mt-3.5'>
                        <span className='text-h4 font-medium text-gray-500'>Location</span>
                        <div className='flex justify-between items-center border border-gray-400 mt-1 text-h2 rounded-xl'>
                            <span className='pt-2 pb-2 pl-5 pr-3 mr-10  w-full'>{soMainLocName}</span>
                            <button onClick={() => {
                                dispatch(setOpen(true))
                            }} className='text-primary border-border py-2 px-3 cursor-pointer'>Detect</button>
                        </div>
                    </div>
                </div>

                {/* brand and model and age and Original price of product */}
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-3.5 '>
                    <div className='grid w-full'>
                        <span className='text-h4 font-medium text-gray-500'>Brand</span>
                        <input className='text-h2 border border-border rounded-xl mt-1 pt-2 pb-2 pl-3 outline-0 ' type="text" placeholder=' brand' name='brand' value={postInfo.brand} onChange={handleChange} />
                    </div>

                    <div className='grid w-full'>
                        <span className='text-h4 font-medium text-gray-500'>Model</span>
                        <input className='text-h2 border border-border rounded-xl mt-1 pt-2 pb-2 pl-3 outline-0 ' type="text" placeholder=' model' name='model' value={postInfo.model} onChange={handleChange} />
                    </div>
                    <div className='grid w-full'>
                        <span className='text-h4 font-medium text-gray-500'>Product Age</span>
                        <input className='text-h2 border border-border rounded-xl mt-1 pt-2 pb-2 pl-3 outline-0 ' type="text" placeholder=' product age' name='product_age' value={postInfo.product_age} onChange={handleChange} />
                    </div>

                    <div className='grid w-full'>
                        <span className='text-h4 font-medium text-gray-500'>Original price</span>
                        <input className='text-h2 border border-border rounded-xl mt-1 pt-2 pb-2 pl-3 outline-0 ' type="number" placeholder='original price' name='original_price' value={postInfo.original_price} onChange={handleChange} />
                    </div>
                </div>


                {/* categories */}
                <div className='grid mt-3.5'>
                    <span className='text-h4 font-medium text-gray-500'>Category</span>
                    <div className='grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2 mt-2'>
                        {
                            categories.map((item, key) => (
                                <button onClick={() => {
                                    setCategoriesActive(item.id)
                                    selectCategory(item.name)
                                }} key={key} className={`text-h2 border border-border hover:bg-secondary hover:border-primary hover:text-text-dark rounded-xl py-2 px-3 w-full ${categoriesActive === item.id ? 'bg-secondary border-primary text-text-dark' : null}`}>{item.name}</button>
                            ))
                        }
                    </div>
                </div>

                {/* conditions */}
                <div className='grid mt-3.5'>
                    <span className='text-h4 font-medium text-gray-500'>Condition</span>
                    <div className='grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-5 gap-2 mt-2'>
                        {
                            conditions.map((item, key) => (
                                <button onClick={() => {
                                    setconditionsActive(item.id)
                                    selectCondition(item.condition)
                                }} key={key} className={`text-h2 border border-border hover:bg-secondary hover:border-primary hover:text-text-dark rounded-xl py-2 px-3 w-full ${conditionsActive === item.id ? 'bg-secondary text-text-dark border-primary' : null}`}>{item.condition}</button>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default PostMain
