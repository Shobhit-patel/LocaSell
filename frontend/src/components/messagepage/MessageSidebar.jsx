import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchChats, setActiveChat } from '../../reducers/features/chat/chatSlice'

const MessageSidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const dispatch = useDispatch()

    const { chats } = useSelector(state => state.chat);

    const user = useSelector((state) => state.signup.user || state.login.user);

    useEffect(() => {
        if (!user) return
        dispatch(fetchChats(user?._id));
    }, [user]);

    function getTimeLabel(timestamp) {
        const diffDays = Math.floor(
            (Date.now() - new Date(timestamp).getTime()) /
            (1000 * 60 * 60 * 24)
        );

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays === 7) return "1 week ago";

        return `${diffDays} days ago`;
    }

    const [selectedUser, setSelectedUser] = useState(chats?.[0])

    const [searchTerm, setSearchTerm] = useState("");

    const filteredChats = chats.filter((chat) => {
        const otherUser = chat?.seller?._id !== user?._id ? chat?.seller : chat?.buyer;

        const fullName = `${otherUser?.firstName || ""} ${otherUser?.lastName || ""}`;

        return fullName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <>
            <div onClick={() => setSidebarOpen(false)} className={`fixed inset-0 bg-black/40 z-10 transition-opacity duration-300 lg:hidden ${sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} />

            <div className={`fixed top-0 left-0 z-10 w-full sm:w-75 lg:w-75 lg:h-190 md:h-full sm:h-full max-sm:h-full border-r border-border overflow-y-auto transform transition-transform duration-300 bg-white text-black dark:bg-gray-900 dark:text-white ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:z-auto lg:h-full lg:w-75 lg:translate-x-0  `}
            >

                <div>
                    <div className='flex justify-between items-center border-b border-border py-3 px-4'>
                        <div className=' text-[15px] font-bold '>Messages</div>
                        <button onClick={() => setSidebarOpen(false)} className=' cursor-pointer lg:hidden'> ✕ </button>
                    </div>
                    <div className='border-b border-border py-2 px-4'>
                        <input className='border border-border outline-none cursor-pointer text-h2 py-2 px-5 w-full rounded-xl bg-white text-black dark:bg-gray-800 dark:text-white' type="search" placeholder='Search conversations...' value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {
                        filteredChats.map((chat) => (
                            <div key={chat?._id} onClick={() => {
                                dispatch(setActiveChat(chat))
                                setSelectedUser(chat)
                                setSidebarOpen(false)
                            }} className={`flex justify-between items-center border-b border-border hover:bg-secondary dark:hover:text-black cursor-pointer px-5 py-3 ${selectedUser == chat ? 'bg-secondary dark:text-black' : null}`}>
                                <div className='flex gap-2 '>
                                    <img className='w-10 h-10 bg-gray-200 rounded-xl' src={chat?.Product?.image?.[0]} alt="pro" />
                                    <div className='flex flex-col justify-center w-40 h-10'>
                                        {
                                            chat?.seller?._id !== user?._id ?
                                                <span className='text-h2 font-medium'>{chat?.seller?.firstName} {chat?.seller?.lastName}</span>
                                                :
                                                <span className='text-h2 font-medium'>{chat?.buyer?.firstName} {chat?.buyer?.lastName}</span>
                                        }
                                        <span className='text-h4 text-gray-500'>{chat?.Product?.name} <span>· ₹{chat?.Product?.price}</span></span>

                                        <span className='text-h4 text-gray-500'>{chat?.lastMessage}</span>
                                    </div>
                                </div>

                                <button className='text-h5 text-gray-500 rounded-xl cursor-pointer'>{getTimeLabel(chat.updatedAt)} </button>
                            </div>
                        ))
                    }

                </div>
            </div>
        </>
    )
}

export default MessageSidebar
