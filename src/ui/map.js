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

    // Initial load to get user's position
    useEffect(() => {
        (async () => {
            const [lat, lng] = await whereAmI();
            if (lat && lng) {
                setPosition([lat, lng]);
            }
        })();
        L.Icon.Default.imagePath = '/marker.png';
    }, []);


    useEffect(() => {
        try {
            if (mapRef?.current && position && client) {

                const mapInstance = mapRef?.current;
                const Control = L.Routing.control({
                    waypoints: [
                        L.latLng(position),
                        L.latLng(client)
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
                return () => { mapInstance.removeControl(Control) }
            }
        }
        catch (error) {
            console.log("error occured", error);
        }
    }, [position, client]);



    const LocationMarker = () => {
        const map = useMap();
        useEffect(() => {
            if (map && position) {
                map.flyTo(position, map.getZoom());
            }
        }, [map, position]);

        return position ? (
            <Marker position={position} icon={customIcon} >
                <Popup>You are here</Popup>
            </Marker>
        ) : null;
    };

    const DestinationMarker = () => {
        return client ? (
            <Marker position={client} icon={destinationIcon}>
                <Popup>Emergency here</Popup>
            </Marker>
        ) : null
    }

    if (!position) return <p>Hold tight. Getting info...</p>;
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
            <DestinationMarker />
        </MapContainer >
    )
}
