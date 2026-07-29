import React, { useEffect, useState } from 'react'
import PostMain from '../components/postpage/PostMain'
import PostSideBar from '../components/postpage/PostSideBar'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setIsOpen } from '../reducers/features/popup/loginPopup'

const PostPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const check = useSelector((state) => state.uploaded.productInfo)
    const token = localStorage.getItem("token")

    useEffect(() => {
        if (!token) {
            dispatch(setIsOpen(true))
            navigate('/')
        }
    }, [])

    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Validation
    const categoryFields = {
        Electronics: ["brand", "model", "warranty"],
        Furniture: ["material", "color"],
        Clothing: ["brand", "size", "color"],
        Books: ["author", "publisher", "language"],
        Vehicles: ["brand", "model", "year", "kmsDriven", "fuelType"],
        Sports: ["brand", "type"],
        Kitchen: ["brand", "material"],
    }

    const invalidTextValues = ["", "na", "n/a", "n.a", "none", "null"]

    const isValidText = (value) => {
        if (value === undefined || value === null) return false
        return !invalidTextValues.includes(value.toString().trim().toLowerCase())
    }

    const requiredFields = categoryFields[check.category] || []
    const categoryComplete = requiredFields.every((field) => isValidText(check.categoryData?.[field]))

    const detailsComplete =
        isValidText(check.name) &&
        isValidText(check.description) &&
        check.price &&
        isValidText(check.product_age) &&
        check.original_price &&
        check.category &&
        check.condition &&
        categoryComplete &&
        check.location

    return (
        <>
            <div>
                <div className='flex justify-between border-b border-border text-h2 font-medium pt-4 pr-7 pb-4 pl-7'>

                    <div className='flex items-center gap-2'>
                        {
                            check.image?.length > 0 ?
                                <span className='bg-primary p-0.5 w-6 h-6 text-center text-white rounded-full'>1</span>
                                :
                                <span className='border p-0.5 w-6 h-6 text-center rounded-full'>1</span>
                        }
                        <span className='cursor-pointer'>Photos</span>
                    </div>

                    <div className='flex items-center gap-2'>
                        {
                            detailsComplete ?
                                <span className='bg-primary p-0.5 w-6 h-6 text-center text-white rounded-full'>2</span>
                                :
                                <span className='border p-0.5 w-6 h-6 text-center rounded-full'>2</span>
                        }
                        <span className='cursor-pointer'>Details</span>
                    </div>

                    <div className='flex items-center gap-2'>
                        {
                            detailsComplete && check.image?.length > 0 ?
                                <span className='bg-primary p-0.5 w-6 h-6 text-center text-white rounded-full'>3</span>
                                :
                                <span className='border p-0.5 w-6 h-6 text-center rounded-full'>3</span>
                        }
                        <span className='cursor-pointer'>Review</span>
                    </div>

                </div>

                <div className='flex mt-0 h-screen overflow-hidden'>
                    <PostMain setSidebarOpen={setSidebarOpen} />
                    <PostSideBar
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />
                </div>
            </div>
        </>
    )
}

export default PostPage
