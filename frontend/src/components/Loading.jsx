import React from 'react'

const Loading = () => {
    return (
        <button>
            <span>Loading </span>
            <span className='animate-ping'>· </span>
            <span className='animate-ping [animation-delay:-.5s]'>· </span>
            <span className='animate-ping [animation-delay:-.3s]'>· </span>
        </button>
    )
}

export default Loading
