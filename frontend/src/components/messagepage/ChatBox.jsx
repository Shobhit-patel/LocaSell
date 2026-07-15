import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../socket/socket';
import { addMessage, fetchMessages } from '../../reducers/features/chat/chatSlice';
import { format } from "date-fns";

const ChatBox = () => {
    const dispatch = useDispatch();
    const seller = useSelector((state) => state.chat.activeChat)

    const { activeChat, messages } = useSelector(state => state.chat);

    const user = useSelector((state) => state.signup.user || state.login.user);

    const bottomRef = useRef(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "auto",
            block: "end",
        });
    }, [messages]);

    useEffect(() => {
        if (!activeChat) return;

        socket.connect();

        socket.emit(
            "join-chat",
            activeChat._id
        );
        dispatch(fetchMessages(activeChat._id));

        socket.on("receive-message", (msg) => {
            dispatch(addMessage(msg));
        });
        return () => {
            socket.off("receive-message");
        }
    }, [activeChat]);

    if (!activeChat) return <h2>Select chat</h2>;

    function getTimeLabel(timestamp) {
        const diffDays = Math.floor(
            (Date.now() - new Date(timestamp).getTime()) /
            (1000 * 60 * 60 * 24)
        );

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays === 7) return "1 week ago";

        return format(new Date(timestamp), "dd MMM yyyy");
    }

    const getTime = (date) => {
        return format(new Date(date), "hh:mm a");
    };

    // seller profile
    const sellerAvatarName = seller?.seller?.firstName?.trim()?.split(/\s+/)?.map(word => word[0].toUpperCase()).join('') + seller?.seller?.lastName?.trim()?.split(/\s+/)?.map(word => word[0].toUpperCase()).join('')
    const sellerAvatar = seller?.seller?.image

    // buyer profile
    const buyerAvatarName = seller?.buyer?.firstName?.trim()?.split(/\s+/)?.map(word => word[0].toUpperCase()).join('') + seller?.buyer?.lastName?.trim()?.split(/\s+/)?.map(word => word[0].toUpperCase()).join('')
    const buyerAvatar = seller?.buyer?.image

    // user
    const userAvatarName = user?.firstName?.trim()?.split(/\s+/)?.map(word => word[0].toUpperCase()).join('') + user?.lastName?.trim()?.split(/\s+/)?.map(word => word[0].toUpperCase()).join('')
    const userAvatar = user?.image

    const renderMessageContent = (mess, isSender = false) => {
        if (mess.type === "location") {
            return (
                <a
                    href={`https://www.google.com/maps?q=${mess.location.latitude},${mess.location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${isSender ? "text-white underline" : "text-blue-600 underline"}`}
                >
                    View Shared Location
                </a>
            );
        }

        return mess.text;
    };

    const renderMessages = () => {
        return messages?.map((mess, index) => {
            const messageDate = format(
                new Date(mess.createdAt),
                "yyyy-MM-dd"
            );

            const previousDate = index > 0
                ? format(
                    new Date(messages[index - 1].createdAt),
                    "yyyy-MM-dd"
                )
                : null;

            const showDate = messageDate !== previousDate;

            const senderId =
                typeof mess.sender === "object"
                    ? mess.sender._id
                    : mess.sender;

            const isMine = senderId === user._id;

            return (
                <React.Fragment key={mess._id}>
                    {
                        showDate &&
                        (
                            <div className='flex justify-center mb-3 text-gray-500 text-h2'>
                                {getTimeLabel(mess.createdAt)}
                            </div>
                        )
                    }

                    {
                        seller?.seller?._id !== user._id
                            ?
                            !isMine ?
                                (
                                    <div className='flex gap-4 my-3'>
                                        <div className='w-8 h-8 flex justify-center items-center rounded-full bg-secondary'>
                                            {
                                                sellerAvatar !== '' ?
                                                    <div className='bg-secondary text-text-dark rounded-full flex justify-center items-center w-8 text-h2 font-bold'>
                                                        {sellerAvatarName}
                                                    </div>
                                                    :
                                                    <img className='rounded-full w-8 h-8' src={sellerAvatar} alt=""
                                                    />
                                            }
                                        </div>

                                        <div className='grid lg:w-110'>
                                            <span className='text-h2'>
                                                {renderMessageContent(mess)}
                                            </span>

                                            <span className='text-h4 text-gray-500 mt-3'>
                                                {getTime(mess.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                )
                                :
                                (
                                    <div className='flex justify-end gap-4 my-3'>
                                        <div className='grid text-end w-fit'>
                                            <span className='text-h2 bg-primary  text-white py-3 px-5 rounded-s-xl rounded-b-xl'>
                                                {renderMessageContent(mess, true)}
                                            </span>
                                            <span className='text-h4 text-gray-500 mt-3'>
                                                {getTime(mess.createdAt)}
                                            </span>
                                        </div>
                                        <div className='w-8 h-8 flex justify-center items-center rounded-full bg-secondary'>
                                            {
                                                userAvatar !== '' ?
                                                    <div className='bg-secondary text-text-dark rounded-full flex justify-center items-center w-8 text-h2 font-bold'>
                                                        {userAvatarName}
                                                    </div>
                                                    :
                                                    <img className='rounded-full w-8 h-8' src={userAvatar} alt=""
                                                    />
                                            }
                                        </div>
                                    </div>
                                )
                            :
                            !isMine ?
                                (
                                    <div className='flex gap-4 my-3'>
                                        <div className='w-8 h-8 flex justify-center items-center rounded-full bg-secondary'>
                                            {
                                                buyerAvatar !== '' ?
                                                    <div className='bg-secondary text-text-dark rounded-full flex justify-center items-center w-8 text-h2 font-bold'>
                                                        {buyerAvatarName}
                                                    </div>
                                                    :
                                                    <img className='rounded-full w-8 h-8' src={buyerAvatar} alt=""
                                                    />
                                            }
                                        </div>
                                        <div className='grid lg:w-110'>
                                            <span className='text-h2'>
                                                {renderMessageContent(mess)}
                                            </span>
                                            <span className='text-h4 text-gray-500 mt-3'>
                                                {getTime(mess.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                )
                                :
                                (
                                    <div className='flex justify-end gap-4 my-3'>
                                        <div className='grid text-end w-fit'>
                                            <span className='text-h2 bg-primary text-white py-3 px-5 rounded-s-xl rounded-b-xl'>
                                                {renderMessageContent(mess, true)}
                                            </span>
                                            <span className='text-h4 text-gray-500 mt-3'>
                                                {getTime(mess.createdAt)}
                                            </span>
                                        </div>

                                        <div className='w-8 h-8 flex justify-center items-center rounded-full bg-secondary'>
                                            {
                                                userAvatar !== '' ?
                                                    <div className='bg-secondary text-text-dark rounded-full flex justify-center items-center w-8 text-h2 font-bold'>
                                                        {userAvatarName}
                                                    </div>
                                                    :
                                                    <img className='rounded-full w-8 h-8' src={userAvatar} alt="" />
                                            }
                                        </div>
                                    </div>
                                )
                    }
                </React.Fragment>
            )

        })
    }

    return (
        <div className='p-5'>
            {renderMessages()}
            <div ref={bottomRef}></div>
        </div>
    )
}

export default ChatBox