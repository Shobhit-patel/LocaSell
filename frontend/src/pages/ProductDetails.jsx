import React, { useEffect, useState } from 'react'
import ProductMain from '../components/productdetails/ProductMain'
import ProductSideBar from '../components/productdetails/ProductSideBar'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from "react-router-dom";
import { submitSoOneListingData } from '../reducers/features/listing/soOneListing'


const ProductDetails = () => {
    window.scrollTo(0, 0)
    const dispatch = useDispatch()
    const { id } = useParams();

    const { loading } = useSelector((state) => state.soOneListing);

    useEffect(() => {
        dispatch(submitSoOneListingData(id));
    }, [dispatch, id]);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <div className='flex mt-0 h-screen overflow-hidden'>
                {
                    loading ?
                        <div className="flex w-full h-120 items-center justify-center">
                            <h1 className='text-3xl'>Loading...</h1>
                        </div>
                        :
                        <>
                            <ProductMain setSidebarOpen={setSidebarOpen} />
                            <ProductSideBar sidebarOpen={sidebarOpen}
                                setSidebarOpen={setSidebarOpen} />
                        </>
                }
            </div>
        </>
    )
}

export default ProductDetails
