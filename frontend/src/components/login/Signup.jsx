import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { submitSignupData } from '../../reducers/features/auth/signup'
import { setIsSignup, setIsSignupOpen } from '../../reducers/features/popup/signupPopup'
import { setIsOpen } from '../../reducers/features/popup/loginPopup'
import toast from 'react-hot-toast'
import close from '../../assets/icons/close.png'

const Signup = () => {
    const dispatch = useDispatch()

    const { loading, error } = useSelector((state) => state.signup)
    const location = useSelector((state) => state.locationCoordinates.currLocation)

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        location: null,
    })

    const handleChange = useCallback((e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }, [])

    useEffect(() => {
        if (location) {
            setFormData(prev => ({
                ...prev,
                location
            }))
        }
    }, [location])

    const [errors, setErrors] = useState({})
    const emailRegex = useMemo(() => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, [])

    const validate = useCallback(() => {
        let newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'first name is required'
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'last name is required'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email"
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirm Password is required'
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'password and confirm password are not same'
        }

        return newErrors
    }, [formData, emailRegex])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const validationErrors = validate()

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
        } else {
            setErrors({})
            const result = await dispatch(submitSignupData(formData))

            if (submitSignupData.fulfilled.match(result)) {
                dispatch(setIsSignupOpen(false))
                dispatch(setIsSignup(true))
                toast.success('Welcome to locaSell city local market')
            } else {
                toast.error(error)
            }
        }
    }

    return (
        <div >
            <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-20 " onClick={() => dispatch(setIsSignupOpen(false))}>
                <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-900 text-black dark:text-white flex flex-col justify-center w-140 h-125 mx-4 p-5 relative text-left text-sm rounded-xl ">

                    <div onClick={() => dispatch(setIsSignupOpen(false))} className='absolute right-5 top-5 bg-secondary p-2 rounded-full cursor-pointer'>
                        <img className='w-3 cursor-pointer' src={close} alt="" />
                    </div>

                    <div className='flex justify-center items-center gap-1.5 mb-5'>
                        <span className='text-heading font-bold'>Welcome to </span>
                        <div>
                            <span className='text-primary text-heading font-bold '>loca</span>
                            <span className='text-heading font-bold'>sell</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className='flex gap-2.5 mb-5'>
                            <div>
                                <label className='py-2.5 px-4 ml-0.5 font-medium' htmlFor="firstName">First Name</label>
                                <input className='w-full  border border-border outline-none rounded-xl mt-1  py-2.5 px-4' id='firstName' name='firstName' type="text" value={formData.firstName} placeholder="Enter your first name" onChange={handleChange} />
                                <p className='text-red-500 text-h2 mt-1 ml-5'>{errors.firstName}</p>
                            </div>
                            <div>
                                <label className='py-2.5 px-4 ml-0.5 font-medium' htmlFor="lastName">Last Name</label>
                                <input className='w-full  border border-border outline-none rounded-xl mt-1  py-2.5 px-4' id='lastName' name='lastName' type="text" value={formData.lastName} placeholder="Enter your last name" onChange={handleChange} />
                                <p className='text-red-500 text-h2 mt-1 ml-5'>{errors.lastName}</p>
                            </div>
                        </div>

                        <div className='mb-5'>
                            <label className='py-2.5 px-4 ml-0.5 font-medium' htmlFor="email">Email</label>
                            <input className='w-full  border border-border outline-none rounded-xl mt-1 py-2.5 px-4' id='email' name='email' type="email" value={formData.email} placeholder="Enter your email" onChange={handleChange} />
                            <p className='text-red-500 text-h2 mt-1 ml-5'>{errors.email}</p>
                        </div>

                        <div className='flex gap-2.5 mb-5'>
                            <div className='w-full'>
                                <label className='py-2.5 px-4 ml-0.5  font-medium' htmlFor="password">Password</label>
                                <input className='w-full  border border-border outline-none rounded-xl mt-1 py-2.5 px-4' id='password' name='password' type="password" value={formData.password} placeholder="password" onChange={handleChange} />
                                <p className='text-red-500 text-h2 mt-1 ml-5'>{errors.password}</p>
                            </div>
                            <div className='w-full'>
                                <label className='py-2.5 px-4 ml-0.5  font-medium' htmlFor="confirmPassword">Confirm Password</label>
                                <input className='w-full  border border-border outline-none rounded-xl mt-1 py-2.5 px-4' id='confirmPassword' name='confirmPassword' type="password" value={formData.confirmPassword} placeholder="confirm password" onChange={handleChange} />
                                <p className='text-red-500 text-h2 mt-1 ml-5'>{errors.confirmPassword}</p>
                            </div>
                        </div>

                        <button disabled={loading} className='bg-primary w-full text-white text-h2 font-medium font-stretch-130% text-center rounded-xl cursor-pointer mb-3 pt-3 pb-3 '>
                            {loading ? 'Loading...' : 'Signup'}
                        </button>
                    </form>

                    <p className="text-center cursor-pointer mt-4">Already have an account! <a onClick={() => {
                        dispatch(setIsOpen(true))
                        dispatch(setIsSignupOpen(false))
                    }} className="text-primary cursor-pointer underline">Log in</a></p>

                </div>
            </div>
        </div>
    )
}

export default Signup
