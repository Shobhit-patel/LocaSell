import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setImagePopupOpen } from '../reducers/features/imagePopupSlice'
import close from '../assets/icons/close.png'

const ImagePopup = () => {
    const dispatch = useDispatch()
    const { imageUrl } = useSelector((state) => state.imagePopup)

    return (
        <>
            <div onClick={() => dispatch(setImagePopupOpen(false))} className='fixed inset-0 bg-black/60 flex justify-center items-center z-10' >
                <div className='flex justify-center items-center rounded-xl overflow-hidden relative h-150' onClick={(e) => e.stopPropagation()}>
                    <img className=' h-150' src={imageUrl} alt="" />

                    <div onClick={() => dispatch(setImagePopupOpen(false))} className='absolute right-5 top-5 bg-secondary p-2 rounded-full cursor-pointer'>
                        <img className='w-3 cursor-pointer' src={close} alt="" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ImagePopup
