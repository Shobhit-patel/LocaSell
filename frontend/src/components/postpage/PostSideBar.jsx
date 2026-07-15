import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { submitListingData } from '../../reducers/features/listing/listing'
import toast from 'react-hot-toast'

const PostSideBar = ({ sidebarOpen, setSidebarOpen }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [disabled, setDisabled] = useState(false);

    const { loading } = useSelector((state) => state.listing)

    const product = useSelector((state) => state.uploaded.productInfo)

    const preview = useSelector((state) => state.uploaded.image?.[0])

    const locName = useSelector((state) => state.location.currLocationName)
    const soMainLocName = locName.split(',')[0]

    const onPost = async () => {
        if (
            product.name &&
            product.description &&
            preview?.length > 0 &&
            product.price &&
            product.product_age &&
            product.original_price &&
            product.category &&
            product.condition &&
            soMainLocName !== 'Set Location'
        ) {
            setDisabled(true);
            const formData = new FormData()

            formData.append("name", product.name)
            formData.append("description", product.description)
            formData.append("price", product.price)
            formData.append("original_price", product.original_price)
            formData.append("category", product.category)
            formData.append("condition", product.condition)
            formData.append("brand", product.brand)
            formData.append("model", product.model)
            formData.append("product_age", product.product_age)

            formData.append(
                "location",
                JSON.stringify(product.location)
            )

            product?.image.forEach((file) => {
                formData.append("image", file)
            })

            await dispatch(submitListingData(formData))
            toast.success('Congratulations your product is listed')
            navigate('/')

        } else {
            toast.error('All filed are require')
        }
    }

    return (
        <>
            <div onClick={() => setSidebarOpen(false)} className={`fixed inset-0 bg-black/40 z-10 transition-opacity duration-300 lg:hidden ${sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} />

            {/* Sidebar */}
            <div className={`fixed top-0 right-0 z-10 w-full sm:w-95 lg:w-95 lg:h-190 md:h-full sm:h-full max-sm:h-full border-l border-border overflow-y-auto transform transition-transform duration-300 bg-white text-black dark:bg-gray-900 dark:text-white ${sidebarOpen ? "translate-x-0" : "translate-x-full"} lg:static lg:z-auto lg:h-full lg:w-95 lg:translate-x-0  `}
            >

                <div className=' px-5 py-3 lg:h-190 md:h-full sm:h-full max-sm:h-full overflow-y-auto scrollbar-thumb-white'>

                    <button onClick={() => setSidebarOpen(false)} className='block cursor-pointer lg:hidden mr-5'> ✕ </button>

                    <span className='text-gray-500 text-h2 font-semibold '>Live preview</span>

                    {
                        product.name || product.price || product.category || product.condition || preview || soMainLocName != 'Set Location' ?
                            <div className='border border-border rounded-xl cursor-pointer mt-3 w-full'>
                                {
                                    preview?.length > 0 ?
                                        <div className='flex justify-center overflow-hidden bg-secondary h-40 rounded-t-xl'>
                                            <img className='h-40' src={preview} alt="product" />
                                        </div>
                                        :
                                        null
                                }
                                <div className='grid p-3 '>
                                    {
                                        product.price ?
                                            <span className='text-heading text-primary font-bold'>₹ {product.price}</span>
                                            :
                                            null
                                    }
                                    {
                                        product.name ?
                                            <span className='text-h1'>{product.name}</span>
                                            :
                                            null
                                    }
                                    <div className='flex items-center gap-2 mt-2.5'>
                                        {
                                            product.category ?
                                                <span className='text-h4 border border-border rounded-full py-0.5 px-1.5'>{product.category}</span>
                                                :
                                                null
                                        }

                                        {
                                            product.condition ?
                                                <span className='text-h4 border border-primary text-text-dark bg-secondary rounded-full py-0.5 px-1.5'>{product.condition}</span>
                                                :
                                                null
                                        }

                                        {
                                            soMainLocName != 'Set Location' ?
                                                <span className='text-h4 border border-border rounded-full py-0.5 px-1.5'>{soMainLocName}</span>
                                                :
                                                null
                                        }
                                    </div>
                                </div>
                            </div>
                            :
                            null
                    }

                    <div className='border border-border rounded-xl mt-3 p-3    '>
                        <span className='text-h2 font-medium'>Tips for a quick sale</span>
                        <div className='flex flex-col gap-2  my-1 mx-2'>
                            <span className='text-h3'>Use natural lighting for photos — front, back, and any defects</span>
                            <span className='text-h3'>Price 10–20% below market to attract fast offers</span>
                            <span className='text-h3'>Listings under 24 hrs old get 3× more views</span>
                        </div>
                    </div>

                    {/* buttons */}
                    <button disabled={disabled} onClick={() => {
                        onPost()
                    }} className='bg-primary text-white text-h2 font-medium font-stretch-130% text-center rounded-xl cursor-pointer w-full mt-4 pt-3 pb-3'>
                        {loading ? 'loading...' : 'Post listing --'}
                    </button>

                    {/* add in future */}
                    {/* <div className='border border-border text-h2 font-medium font-stretch-130% text-center rounded-xl cursor-pointer mt-2 pt-3 pb-3'>
                    <button className='cursor-pointer'>Save as draft</button>
                    </div> */}
                </div>

            </div>
        </>
    )
}

export default PostSideBar
