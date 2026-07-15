import React, { useEffect, useState } from 'react'
import MessageSidebar from '../components/messagepage/MessageSidebar'
import MessageMain from '../components/messagepage/MessageMain'
import { useDispatch, useSelector } from 'react-redux'
import { setIsOpen } from '../reducers/features/popup/loginPopup'
import { useNavigate } from 'react-router-dom'

const MessagePage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const seller = useSelector((state) => state.chat.activeChat)
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      dispatch(setIsOpen(true))
      navigate('/')
    }
  }, [])

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className='flex h-dvh'>
        <MessageSidebar sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen} />
        {
          !seller?.Product ?
            <div className='flex-1 text-center'>
              <button className='w-full p-5 lg:hidden text-right '>
                <img onClick={() => setSidebarOpen(true)} className='w-5 cursor-pointer ' src="../../../src/assets/icons/hamburger.png" alt="" />
              </button>
              <h1 className='font-extrabold font-stretch-150% text-logo mt-30'>Select user to start chat</h1>
            </div>

            :
            <MessageMain setSidebarOpen={setSidebarOpen} />
        }
      </div>
    </>
  )
}

export default MessagePage
