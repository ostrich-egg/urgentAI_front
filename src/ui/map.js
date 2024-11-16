"use client"
import 'leaflet/dist/leaflet.css'
import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
import { whereAmI } from '../lib/getLocation'
import L from 'leaflet'
import "leaflet-routing-machine"
import "leaflet-control-geocoder";
import styles from "./MapStyle.module.css"



export default function MapComponent({ client }) {
    const [position, setPosition] = useState(null);
    const mapRef = useRef();
    const [theClient, setTheClient] = useState(null);

    const customIcon = new L.Icon({
        iconUrl: "/homemarker.png",
        iconSize: [60, 60],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    })

    const destinationIcon = new L.Icon({
        iconUrl: "/marker.png",
        iconSize: [60, 60],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    })


    useEffect(() => {
        const _theclient = { lat: client.latitude, lng: client.longitude }
        setTheClient(_theclient);
    }, [client])

    useEffect(() => {

        if (typeof window == undefined) return;
        (async () => {
            const [latitude, longitude] = await whereAmI();
            if (latitude && longitude) {
                setPosition([latitude, longitude]);
            }
        })();
        L.Icon.Default.imagePath = '/marker.png';
    }, []);


    useEffect(() => {
        try {
            if (mapRef?.current && position && theClient) {

                const mapInstance = mapRef?.current;
                const Control = L.Routing.control({
                    waypoints: [
                        L.latLng(position),
                        L.latLng(theClient)
                    ],
                    lineOptions: {
                        styles: [{ color: "#6FA1EC", weight: 4, height: "100px", width: "100px" }]
                    },
                    routeWhileDragging: true,
                    draggableWaypoints: true,
                    autoRoute: true,
                    fitSelectedRoutes: true,
                    geocoder: L.Control.Geocoder.nominatim(),
                    createMarker: () => null,

                })?.addTo(mapInstance);

                const routingContainer = document.querySelector(".leaflet-routing-container");
                if (routingContainer) {
                    routingContainer.classList.add(styles.routingControls)
                }
                return () => {
                    try {
                        mapInstance && mapInstance.removeControl(Control)
                    } catch (error) {
                        console.log("Error occured ", error)
                    }
                }
            }
        }
        catch (error) {
            console.log("error occured", error);
        }
    }, [position, theClient]);



    const LocationMarker = () => {
        // const map = useMap();
        useEffect(() => {
            if (mapRef.current && position) {
                mapRef.current.flyTo(position, mapRef.current.getZoom());
            }
        }, [mapRef.current, position]);

        return position ? (
            <Marker position={position} icon={customIcon} >
                <Popup>You are here </Popup>
            </Marker>
        ) : null;
    };

    const DestinationMarker = () => {
        return theClient ? (
            <Marker position={theClient} icon={destinationIcon} >
                <Popup>Emergency here </Popup>
            </Marker>
        ) : null
    }

    if (!position) return <p>Hold tight.Getting info...</p>;

    return (
        <MapContainer
            center={position}
            zoom={16}
            scrollWheelZoom={false}
            ref={mapRef}
            className={`w-full h-full overflow-scroll ${styles.MapComponent}`}
        >
            <TileLayer
                attribution='& copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
            < DestinationMarker />
        </MapContainer >
    )
}


// import React, { useState, useEffect } from 'react';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { MapPin, Navigation2 } from 'lucide-react';

// const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // Earth's radius in km
//     const dLat = (lat2 - lat1) * Math.PI / 180;
//     const dLon = (lon2 - lon1) * Math.PI / 180;
//     const a =
//         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//         Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return (R * c).toFixed(2);
// };

// const calculateBearing = (lat1, lon1, lat2, lon2) => {
//     const dLon = (lon2 - lon1) * Math.PI / 180;
//     const y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);
//     const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
//         Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon);
//     let brng = Math.atan2(y, x) * 180 / Math.PI;
//     brng = (brng + 360) % 360;
//     return brng.toFixed(0);
// };

// const MapComponent = ({ client }) => {
//     const [currentPosition, setCurrentPosition] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         if ('geolocation' in navigator) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     setCurrentPosition({
//                         latitude: position.coords.latitude,
//                         longitude: position.coords.longitude
//                     });
//                     setLoading(false);
//                 },
//                 (err) => {
//                     setError('Unable to get your location');
//                     setLoading(false);
//                 }
//             );
//         } else {
//             setError('Geolocation is not supported by your browser');
//             setLoading(false);
//         }
//     }, []);

//     if (loading) {
//         return (
//             <Card className="w-full h-64">
//                 <CardContent className="flex items-center justify-center h-full">
//                     <p>Getting location information...</p>
//                 </CardContent>
//             </Card>
//         );
//     }

//     if (error) {
//         return (
//             <Card className="w-full h-64">
//                 <CardContent className="flex items-center justify-center h-full">
//                     <p className="text-red-500">{error}</p>
//                 </CardContent>
//             </Card>
//         );
//     }

//     if (!currentPosition || !client?.latitude || !client?.longitude) {
//         return (
//             <Card className="w-full h-64">
//                 <CardContent className="flex items-center justify-center h-full">
//                     <p>Location information unavailable</p>
//                 </CardContent>
//             </Card>
//         );
//     }

//     const distance = calculateDistance(
//         currentPosition.latitude,
//         currentPosition.longitude,
//         client.latitude,
//         client.longitude
//     );

//     const bearing = calculateBearing(
//         currentPosition.latitude,
//         currentPosition.longitude,
//         client.latitude,
//         client.longitude
//     );

//     return (
//         <Card className="w-full">
//             <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                     <Navigation2 className="h-5 w-5" /> Route Information
//                 </CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <div className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="flex items-center gap-2 bg-secondary p-4 rounded-lg">
//                             <MapPin className="h-5 w-5 text-primary" />
//                             <div>
//                                 <p className="text-sm font-medium">Your Location</p>
//                                 <p className="text-xs text-muted-foreground">
//                                     {currentPosition.latitude.toFixed(6)}, {currentPosition.longitude.toFixed(6)}
//                                 </p>
//                             </div>
//                         </div>
//                         <div className="flex items-center gap-2 bg-secondary p-4 rounded-lg">
//                             <MapPin className="h-5 w-5 text-destructive" />
//                             <div>
//                                 <p className="text-sm font-medium">Emergency Location</p>
//                                 <p className="text-xs text-muted-foreground">
//                                     {client.latitude.toFixed(6)}, {client.longitude.toFixed(6)}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-secondary p-4 rounded-lg">
//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <p className="text-sm font-medium">Distance</p>
//                                 <p className="text-2xl font-bold">{distance} km</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm font-medium">Direction</p>
//                                 <div className="flex items-center gap-2">
//                                     <Navigation2
//                                         className="h-6 w-6"
//                                         style={{ transform: `rotate(${bearing}deg)` }}
//                                     />
//                                     <p className="text-2xl font-bold">{bearing}°</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// };

// export default MapComponent;