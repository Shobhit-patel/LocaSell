import React, { useCallback, useEffect } from "react";
import { Circle, MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useDispatch, useSelector } from "react-redux";
import { getLocationName, getPopUpLocationName } from "../reducers/features/locationSlice";
import LocationSearch from "./LocationSearch";
import { setOpen } from "../reducers/features/popup/mapPopup";
import { getLocation, getPopUpLocation } from "../reducers/features/location/locationCoordinates";
import { editProfile } from "../reducers/features/auth/login";
import toast from "react-hot-toast";

function MapEvents({ dispatch }) {
    useMapEvents({
        moveend() {
            const center = this.getCenter();
            dispatch(getPopUpLocation({ lat: center.lat, lng: center.lng, }))
        },
    });
    return null;
}

function RecenterMap({ location }) {
    const map = useMap();

    useEffect(() => {
        if (location?.lat && location?.lng) {
            map.setView([location.lat, location.lng]);
        }
    }, [map, location?.lat, location?.lng]);
    return null;
}


const PopupMap = () => {
    const dispatch = useDispatch()
    const location = useSelector((state) => state.locationCoordinates?.currPopUpLocation)
    const locationName = useSelector((state) => state.location?.currPopUpLocationName)

    useEffect(() => {
        if (!location?.lat || !location?.lng) return;

        const fetchName = async () => {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${location?.lat}&lon=${location?.lng}&format=json`
            );

            const data = await res.json();
            dispatch(getPopUpLocationName(data.display_name));
        };
        fetchName();
    }, [location?.lat, location?.lng, dispatch]);

    const radius = useSelector((state) => state.soListing.filter?.radius) || 5
    const center = React.useMemo(
        () => [location?.lat, location?.lng],
        [location?.lat, location?.lng]
    );

    const handleApply = useCallback(() => {
        toast.success("Location applied successfully");

        dispatch(getLocationName(locationName));
        dispatch(getLocation(location));

        dispatch(editProfile({
            latitude: location.lat,
            longitude: location.lng,
        }));

        dispatch(setOpen(false));
    }, [dispatch, location, locationName]);

    return (
        <div >
            <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-10" onClick={() => dispatch(setOpen(false))}>
                <div className='bg-white dark:bg-gray-900 text-black dark:text-white relative flex flex-col justify-center w-140 h-auto mx-4 px-5 py-10 text-left text-sm rounded-xl' onClick={(e) => e.stopPropagation()} >

                    <div onClick={() => dispatch(setOpen(false))} className='absolute right-5 top-5 bg-secondary p-2 rounded-full cursor-pointer'>
                        <img className='w-3 cursor-pointer' src="../../../src/assets/icons/close.png" alt="" />
                    </div>

                    <div className="text-center mb-5">
                        <span className='text-heading font-bold dark:text-white'>Search your location</span>
                    </div>

                    <div className=" relative">
                        <LocationSearch />
                    </div>

                    <MapContainer center={location} attributionControl={false} zoom={13} className="z-10 mt-14 h-[250px] w-full rounded-xl border border-border dark:border-gray-700 " >
                        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        <MapEvents dispatch={dispatch} />
                        <RecenterMap location={location} />
                        {
                            location?.lat && location?.lng ?
                                <Circle center={center} radius={radius * 1000} pathOptions={{ color: "#1D9E75", fillColor: "#64c7a4", fillOpacity: 0.3, }} />
                                :
                                null
                        }
                    </MapContainer>

                    <div className='absolute lg:top-59.5 lg:left-[46.5%] top-59 left-[45%] z-30 text-4xl '  >
                        📍
                    </div>

                    <div className="text-center m-5">
                        <span className="text-gray-600 dark:text-gray-300">{locationName}</span>
                    </div>

                    <button onClick={handleApply} className="bg-primary w-full text-white text-h2 font-medium font-stretch-130% text-center rounded-xl cursor-pointer pt-3 pb-3">Apply</button>
                </div>
            </div>
        </div>
    )
}

export default PopupMap
