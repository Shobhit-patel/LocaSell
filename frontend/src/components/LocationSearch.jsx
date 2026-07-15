import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { getPopUpLocationName } from "../reducers/features/locationSlice";
import { getPopUpLocation } from "../reducers/features/location/locationCoordinates";

export default function LocationSearch() {
    const dispatch = useDispatch()

    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const searchLocations = async (value) => {
        setQuery(value);

        if (value.length < 2) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await fetch(
                `https://photon.komoot.io/api/?q=${encodeURIComponent(
                    value
                )}&limit=5`
            );

            const data = await response.json();

            const places = data.features.map((item) => ({
                name: [
                    item.properties.name,
                    item.properties.city,
                    item.properties.state,
                    item.properties.country,
                ]
                    .filter(Boolean)
                    .join(", "),
                lat: item.geometry.coordinates[1],
                lng: item.geometry.coordinates[0],
            }));

            setSuggestions(places);
        } catch (error) {
            console.error(error);
        }
    };

    const selectLocation = useCallback(
        (place) => {
            setQuery(place.name);
            setSuggestions([]);

            dispatch(getPopUpLocation({ lat: place.lat, lng: place.lng }));

            dispatch(getPopUpLocationName(place.name));
        },
        [dispatch]
    );


    return (
        <div className='w-full z-50 absolute'>
            <input type="search" placeholder="Search location..." value={query} onChange={(e) => searchLocations(e.target.value)} className='border border-border dark:border-gray-700 rounded-xl outline-none py-2 px-5 w-full bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400' />

            {suggestions.length > 0 && (
                <div className='border-x border-b border-border dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl m-auto w-auto max-h-70 overflow-y-auto' >
                    {suggestions.map((place, index) => (
                        <div key={index} onClick={() => selectLocation(place)} className="px-5 py-2 cursor-pointer border-b border-border/40 dark:border-gray-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700" >
                            {place.name}
                        </div>

                    ))}
                </div>
            )}

        </div>
    );
}