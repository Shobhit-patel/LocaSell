import React, { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsSignupOpen } from '../../reducers/features/popup/signupPopup'
import { setIsLogin, setIsOpen } from '../../reducers/features/popup/loginPopup'
import { submitLoginData } from '../../reducers/features/auth/login'
import toast from 'react-hot-toast'
import close from '../../assets/icons/close.png'

const Login = () => {
    const dispatch = useDispatch()

    const { loading, error } = useSelector((state) => state.login)

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const [errors, setErrors] = useState({})

    const emailRegex = useMemo(
        () => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        []
    )

    const handleChange = useCallback((e) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }, [])


    const validate = useCallback(() => {
        const newErrors = {}

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email"
        }

        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
        }

        return newErrors
    }, [formData, emailRegex])


    const closeLogin = () => {
        dispatch(setIsOpen(false))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const validationErrors = validate()

        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors)
            return
        }

        setErrors({})

        try {
            const result = await dispatch(submitLoginData(formData)).unwrap()

            if (result.success) {
                dispatch(setIsOpen(false))
                dispatch(setIsLogin(true))

                toast.success("Welcome back to locaSell city local market")
            }

        } catch (err) {
            toast.error(err?.message || error)
        }
    }


    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-20" onClick={closeLogin} >
            <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-900 text-black dark:text-white flex flex-col justify-center w-140 max-h-190 min-h-110 mx-4 px-5 py-12 relative text-left text-sm rounded-xl" >

                <button type="button" onClick={closeLogin} className="absolute right-5 top-5 bg-secondary p-2 rounded-full cursor-pointer "  >
                    <img className="w-3" src={close} alt="Close" />
                </button>


                <div className="flex justify-center items-center gap-1.5 mb-5">
                    <span className="text-heading font-bold">
                        Welcome back to
                    </span>

                    <div>
                        <span className="text-primary text-heading font-bold">
                            loca
                        </span>

                        <span className="text-heading font-bold">
                            sell
                        </span>
                    </div>
                </div>


                <form onSubmit={handleSubmit}>

                    <div className="mb-5">
                        <label className="py-2.5 px-4 ml-0.5 font-medium" htmlFor="email" >  Email   </label>
                        <input className=" w-full  border border-border outline-none rounded-xl mt-1 py-2.5 px-4 " id="email" name="email" type="email" value={formData.email} placeholder="Enter your email" onChange={handleChange} />
                        {
                            errors.email && <p className="text-red-500 text-h2 mt-1 ml-5"> {errors.email}  </p>
                        }
                    </div>

                    <div>
                        <label className="py-2.5 px-4 font-medium" htmlFor="password" > Password </label>
                        <input className=" w-full border border-border outline-none rounded-xl py-2.5 px-4 mt-1 " id="password" name="password" type="password" value={formData.password} placeholder="Enter your password" onChange={handleChange} />
                        {
                            errors.password && <p className="text-red-500 text-h2 mt-1 ml-5">{errors.password} </p>
                        }
                    </div>

                    <div className="text-right py-4">
                        <button type="button" className=" text-gray-700 dark:text-gray-300 underline" > Forgot Password </button>
                    </div>

                    <button disabled={loading} className=" bg-primary w-full text-white text-h2 font-medium font-stretch-130% text-center rounded-xl cursor-pointer mb-3 pt-3 pb-3" >
                        {loading ? "Loading..." : "Log in"}
                    </button>
                </form>

                <p className="text-center mt-4">
                    Don’t have an account?

                    <button
                        type="button"
                        onClick={() => {
                            dispatch(setIsOpen(false))
                            dispatch(setIsSignupOpen(true))
                        }}
                        className=" text-primary underline ml-1 cursor-pointer " >
                        Signup
                    </button>
                </p>
            </div>
        </div>
    )
}

export default Login
