import React, { useState } from 'react'
import ChatBox from './ChatBox'
import { useDispatch, useSelector } from 'react-redux'
import { socket } from '../../socket/socket';
import { submitSoOneListingData, toggleListingStatus } from '../../reducers/features/listing/soOneListing';
import { useNavigate } from 'react-router-dom';
import { setActiveChat } from '../../reducers/features/chat/chatSlice';

const MessageMain = ({ setSidebarOpen }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const user = useSelector((state) => state.signup.user || state.login.user);

  const seller = useSelector((state) => state.chat.activeChat)
  const [text, setText] = useState("");

  const listing = useSelector(state => state.soListing.soListing)
  const singleProduct = listing?.find((product) => product?._id === seller?.Product?._id)

  const send = () => {
    if (!text) return;

    const chat = seller;

    const receiverId =
      chat?.seller?._id === user._id
        ? chat?.buyer?._id
        : chat?.seller?._id;

    socket.emit("send-message",
      {
        chatId: chat?._id,
        sender: user._id,
        receiver: receiverId,
        type: "text",
        text
      }
    );
    setText("");
  }

  const toggleStatus = async () => {
    try {
      const updatedProduct = await dispatch(toggleListingStatus(singleProduct?._id)).unwrap();
      dispatch(setActiveChat({
        ...seller,
        Product: updatedProduct,
      })
      );
    } catch (err) {
      console.log(err);
    }
  };

  //share location
  const shareLocation = () => {
    const chat = seller;

    const receiverId =
      chat?.seller?._id === user._id
        ? chat?.buyer?._id
        : chat?.seller?._id;

    if (!user?.location?.coordinates?.[1] || !user?.location?.coordinates?.[0]) {
      alert("Location not available in your profile");
      return;
    }

    socket.emit("send-message", {
      chatId: chat._id,
      sender: user._id,
      receiver: receiverId,
      type: "location",
      location: {
        latitude: user.location?.coordinates?.[1],
        longitude: user.location?.coordinates?.[0],
      },
    });
  };

  return (
    <div className='flex-1'>
      {/* message user name  */}
      <div className='flex justify-between items-center border-b border-border px-5 py-3'>
        <div className='flex gap-2 '>
          <img className='w-10 h-10 bg-gray-200 rounded-xl' src={seller?.Product?.image?.[0]} alt="" />
          <div className='grid'>
            {
              seller?.seller?._id !== user?._id ?
                <span className='text-h2 font-medium'>{seller?.seller?.firstName} {seller?.seller?.lastName}</span>
                :
                <span className='text-h2 font-medium'>{seller?.buyer?.firstName} {seller?.buyer?.lastName}</span>
            }
            <span className='text-h4 text-primary'>Online know</span>
          </div>
        </div>

        <div className='flex justify-between items-center gap-5'>
          <button onClick={() => {
            dispatch(submitSoOneListingData(seller?.Product?._id))
            navigate('/product-details')
          }} className='border border-border 400 hover:border-primary hover:bg-primary hover:text-white text-h3 px-3 py-1 rounded-xl cursor-pointer'>Product details</button>

          <button className='  lg:hidden text-right '>
            <img onClick={() => setSidebarOpen(true)} className='w-5 cursor-pointer ' src="../../../src/assets/icons/hamburger.png" alt="" />
          </button>
        </div>
      </div>

      {/* product detail controll my seller */}
      {
        user._id === seller?.seller?._id ?
          <div className='flex justify-between items-center border-b border-border px-5 py-3'>
            <div className='flex gap-2.5 '>
              <img className='w-12 h-12 bg-gray-200 rounded-xl' src={seller?.Product?.image?.[0]} alt="" />
              <div className='grid'>
                <span className='text-h1 font-medium'>{seller?.Product?.name}</span>
                <span className='text-[15px] font-bold text-primary'>₹ {seller?.Product?.price}</span>
              </div>
            </div>

            <div className='flex gap-2.5'>
              <button onClick={toggleStatus} className='border border-gray-400 hover:border-primary hover:bg-primary hover:text-white text-h3 px-3 py-1 rounded-xl cursor-pointer'>{seller?.Product?.status === 'active' ? 'Mark sold' : 'Mark active'}
              </button>

              <button onClick={shareLocation} className='border border-gray-400 hover:border-primary hover:bg-primary hover:text-white text-h3 px-3 py-1 rounded-xl cursor-pointer'>Share location</button>

            </div>
          </div>
          :
          null
      }


      {/* add chat box */}
      <div className='border-b overflow-y-scroll scrollbar-none border-border h-110 bg-white dark:bg-gray-900 transition-colors duration-300'>
        <div className='h-110'>
          <ChatBox />
        </div>
      </div>
      {seller?.Product?.status === 'active' ?
        <div className='flex sticky bottom-0 gap-2.5 border-b border-border dark:border-gray-400 bg-white dark:bg-gray-900 px-5 py-3 transition-colors duration-300'>
          <input onChange={e => setText(e.target.value)} type="text" value={text} placeholder='Type a message...' className='h-10 p-3 text-h1 w-full border border-gray-400 dark:border-gray-400 bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-none rounded-xl' />
          <div onClick={send} className='flex justify-center items-center w-20 h-10 bg-primary text-white border border-primary rounded-xl cursor-pointer'>
            <img className='w-5 h-5 invert-100 dark:invert-0' src="../../../src/assets/icons/send.png" alt="send" />
          </div>
        </div>
        :
        <div className='flex-1 text-center py-5'>
          <span className='font-extrabold font-stretch-150% text-logo'>Product Sold</span>
        </div>
      }
    </div>
  )
}

export default MessageMain
