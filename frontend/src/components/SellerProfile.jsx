import React, { useEffect, useMemo } from 'react'
import { setOpen } from '../reducers/features/popup/sellerPopup'
import { useDispatch } from 'react-redux'
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { getPopUpLocation } from '../reducers/features/location/locationCoordinates';
import Rating from './Rating';


function MapEvents({ dispatch }) {
    useMapEvents({
        moveend() {
            const center = this.getCenter();
            dispatch(getPopUpLocation({ lat: center.lat, lng: center.lng }))
        },
    });
    return null;
}

function RecenterMap({ location }) {
    const map = useMap();

    useEffect(() => {
        if (location?.[1] && location?.[0]) {
            map.setView([location?.[1], location?.[0]]);
        }
    }, [location?.[1], location?.[0]]);

    return null;
}

const SellerProfile = ({ seller }) => {
    const dispatch = useDispatch()

    const SellerAvatarName = useMemo(() => {
        const first = seller?.firstName?.trim().split(/\s+/).map((w) => w[0].toUpperCase()).join("") || "";
        const last = seller?.lastName?.trim().split(/\s+/).map((w) => w[0].toUpperCase()).join("") || "";

        return first + last;
    }, [seller?.firstName, seller?.lastName]);
    const SellerAvatar = seller?.avatar

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

    // user rating
    const rating = Math.round(seller?.averageRating || 0)

    const ratingArr = useMemo(
        () => Array.from({ length: rating }, (_, i) => i),
        [rating]
    );

    const center = useMemo(() => {
        if (!seller?.location?.coordinates) return null;

        const [lng, lat] = seller.location.coordinates;
        return [lat, lng];
    }, [seller?.location?.coordinates]);

    return (
        <>
            <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-10" onClick={() => dispatch(setOpen(false))}>
                <div onClick={(e) => e.stopPropagation()} className='bg-white dark:bg-gray-900 text-black dark:text-white relative flex flex-col justify-center w-140 h-auto mx-4 px-5 py-5 text-left text-sm rounded-xl'>

                    <div onClick={() => dispatch(setOpen(false))} className='absolute right-5 top-5 bg-secondary p-2 rounded-full cursor-pointer'>
                        <img className='w-3 cursor-pointer' src="../../../src/assets/icons/close.png" alt="" />
                    </div>

                    <div className='flex justify-start items-center gap-5 mt-5'>
                        <div className='w-30 h-30 rounded-full'>
                            {
                                SellerAvatar === '' ?
                                    <div className='bg-secondary text-text-dark rounded-full flex justify-center items-center w-30 h-30 text-[45px] font-bold '>{SellerAvatarName}</div>
                                    :
                                    <img className=' rounded-full w-30 h-30' src={SellerAvatar} alt="" />
                            }
                        </div>
                        <div className='grid'>
                            <span className='text-[25px] font-medium'>{seller?.firstName} {seller?.lastName}</span>
                            <span className='text-h1 text-gray-500'>Member since {getTimeLabel(seller?.createdAt)}</span>
                        </div>
                    </div>

                    {/* rating */}
                    <div className='flex items-center gap-1 mt-5'>
                        {
                            ratingArr.map((i) => (
                                <img key={i} className='w-3.5 ' src="../../../src/assets/icons/star.png" alt="" />
                            ))
                        }
                        <span className='text-h1 font-bold text-amber-700'>{seller?.averageRating}</span>
                        <span className='text-h1 text-gray-500'>· {seller?.reviewCount} reviews</span>
                    </div>

                    {/* sold data */}
                    <div className='flex justify-around items-center mt-4 border-border'>
                        <div className='grid w-full border-t p-2 border-border text-center'>
                            <span className='text-[20px] font-bold'>{seller?.soldItem}</span>
                            <span className='text-h1 text-gray-500'>sold</span>
                        </div>
                        <div className='grid border-t p-2 border-l border-r border-border text-center w-full'>
                            <span className='text-[20px] font-bold'>{seller?.activeItem}</span>
                            <span className='text-h1 text-gray-500'>active</span>
                        </div>
                        <div className='grid w-full p-2 border-t text-center border-gray-400'>
                            <span className='text-[20px] font-bold text-primary'>{seller?.responsePercent}%</span>
                            <span className='text-h1 text-gray-500'>response</span>
                        </div>
                    </div>

                    <div>
                        <span className='text-h1'>Rate user</span>
                        <Rating sellerId={seller?._id} />
                    </div>

                    {/* map */}
                    {center && (
                        <MapContainer center={center} attributionControl={false} zoom={13} className="z-10 mt-5 h-[250px] w-full rounded-xl border border-border dark:border-gray-700 " >
                            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                            <MapEvents dispatch={dispatch} />
                            <RecenterMap location={seller?.location} />

                        </MapContainer>
                    )}

                    {/* Fixed center pin */}
                    <div className='absolute lg:top-112 lg:left-[46.5%] top-112 left-[45%] z-30 text-4xl '  >
                        📍
                    </div>
                </div>
            </div>
        </>
    )
}

export default SellerProfile

