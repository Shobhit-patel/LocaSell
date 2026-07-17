import React, { useEffect } from 'react'
import { Circle, MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import L from "leaflet";
import 'leaflet/dist/leaflet.css'
import { useSelector } from 'react-redux'
import loader from '../../assets/icons/loader.png'

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function DoCenter({ location, radius }) {
    const map = useMap();

    useEffect(() => {
        if (!location) return;

        const latLng = L.latLng(location.lat, location.lng);

        // radius in meters
        const bounds = latLng.toBounds(radius * 1000 * 2);

        map.fitBounds(bounds, {
            padding: [30, 30],
        });
    }, [location, radius, map]);
    return null;
}


const SoMap = () => {
    const radius = useSelector((state) => state.soListing.filter?.radius) || 5
    const location = useSelector((state) => state.locationCoordinates?.currLocation)
    const center = [location?.lat, location?.lng];
    const user = useSelector((state) => state.signup.user || state.login.user);

    if (location.lng === 0 && location.lat === 0) {
        return (
            <div className='flex justify-center items-center border border-border bg-secondary m-5 h-60 rounded-xl'>
                <span className='text-logo'>Select Location</span>
            </div>
        )
    }

    if (user?.location?.coordinates?.[0] === 0 && user?.location?.coordinates?.[1] === 0) {
        return (
            <div className='flex justify-center items-center border border-border bg-secondary m-5 h-60 rounded-xl'>
                <span className='text-logo'>Select Location</span>
            </div>
        )
    }

    return (
        <>
            <div className='mt-5 mr-5 ml-5 overflow-hidden relative border border-border rounded-xl'>
                {
                    !Number.isFinite(location?.lat) ||
                        !Number.isFinite(location?.lng) ||
                        location.lat === 0 && location.lng === 0 ?
                        <div className='flex justify-center items-center bg-secondary h-60 w-full'>
                            <img className="w-25 animate-spin" src={loader} alt="" />
                        </div>
                        :

                        <MapContainer center={[location?.lat, location?.lng]} zoom={13} zoomControl={false} scrollWheelZoom={false} attributionControl={false} className='h-60 w-full z-0 ' >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            {
                                location?.lat && location?.lng ?
                                    <Circle center={center} radius={radius * 1000} pathOptions={{ color: "#1D9E75", fillColor: "#64c7a4", fillOpacity: 0.3, }} />
                                    :
                                    null
                            }
                            {Number.isFinite(location?.lat) && Number.isFinite(location?.lng) && (
                                <Marker position={[location.lat, location.lng]} />
                            )}
                            <DoCenter location={location} radius={radius} />
                        </MapContainer>
                }
            </div>
        </>
    )
}

export default SoMap
