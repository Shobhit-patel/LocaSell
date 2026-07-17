import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setOpen } from '../../reducers/features/popup/editPopup';
import { editProfile } from '../../reducers/features/auth/login';
import toast from "react-hot-toast";
import close from '../../assets/icons/close.png'

const EditProfile = () => {
    const dispatch = useDispatch();

    const { loading } = useSelector((state) => state.profile);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(editProfile(formData));
        dispatch(setOpen(false))
        toast.success('Profile edited successfully');
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-10 " onClick={() => dispatch(setOpen(false))}>
                <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-900 text-black dark:text-white flex flex-col justify-center w-140 h-70 mx-4 p-5 relative text-left text-sm rounded-xl ">

                    <div onClick={() => dispatch(setOpen(false))} className='absolute right-5 top-5 bg-secondary p-2 rounded-full cursor-pointer'>
                        <img className='w-3 cursor-pointer' src={close} alt="" />
                    </div>

                    <div className='flex justify-center items-center gap-1.5 mb-5'>
                        <span className='text-heading font-bold'>Edit your profile </span>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className='flex gap-2.5 mb-5'>
                            <div>
                                <label className='py-2.5 px-4 ml-0.5 font-medium' htmlFor="firstName">First Name</label>
                                <input className='w-full  border border-border outline-none rounded-xl mt-1  py-2.5 px-4' id='firstName' name='firstName' type="text" value={formData.firstName} placeholder="Enter your first name" onChange={handleChange} />
                            </div>
                            <div>
                                <label className='py-2.5 px-4 ml-0.5 font-medium' htmlFor="lastName">Last Name</label>
                                <input className='w-full  border border-border outline-none rounded-xl mt-1  py-2.5 px-4' id='lastName' name='lastName' type="text" value={formData.lastName} placeholder="Enter your last name" onChange={handleChange} />
                            </div>
                        </div>

                        <button disabled={loading} className='bg-primary w-full text-white text-h2 font-medium font-stretch-130% text-center rounded-xl cursor-pointer mb-3 pt-3 pb-3'>
                            {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </form>

                </div>
            </div>
        </>
    )
}

export default EditProfile
