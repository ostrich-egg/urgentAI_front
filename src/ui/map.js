"use client"
import 'leaflet/dist/leaflet.css'
import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import "leaflet-routing-machine"
import "leaflet-control-geocoder"
import styles from "./MapStyle.module.css"
import { policeStations } from '@/lib/database/dummy_db'

export default function MapComponent({ client }) {
    const [clientLocation, setClientLocation] = useState(null);
    const [nearestStation, setNearestStation] = useState(null);
    const mapRef = useRef();
    const routingControlRef = useRef(null);

    const customIcon = new L.Icon({
        iconUrl: "/homemarker.png",
        iconSize: [30, 30],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    })

    const destinationIcon = new L.Icon({
        iconUrl: "/marker.png",
        iconSize: [40, 40],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    })

    // Calculate the distances from the client location to the police stations
    const calculateDistances = () => {
        if (!clientLocation) return null;

        const distances = policeStations.map(station => {
            const distance = calculateDistance(
                station.located_at.lat,
                station.located_at.lng,
                clientLocation.lat,
                clientLocation.lng
            );

            return {
                ...station,
                distance
            };
        });

        return distances.sort((a, b) => a.distance - b.distance)[0];  // Return only the nearest station
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Number((R * c).toFixed(2));  // Return distance in kilometers
    };

    // Set the client location and nearest station
    useEffect(() => {
        if (client?.latitude && client?.longitude) {
            setClientLocation({
                lat: client.latitude,
                lng: client.longitude
            });
        }
    }, [client]);

    useEffect(() => {
        if (clientLocation) {
            const nearest = calculateDistances();
            setNearestStation(nearest);
        }
    }, [clientLocation]);

    // Handle routing controls
    useEffect(() => {
        if (mapRef?.current && nearestStation && clientLocation) {
            if (routingControlRef.current) {
                mapRef.current.removeControl(routingControlRef.current);
            }

            const control = L.Routing.control({
                waypoints: [
                    L.latLng(clientLocation.lat, clientLocation.lng),
                    L.latLng(nearestStation.located_at.lat, nearestStation.located_at.lng)
                ],
                lineOptions: {
                    styles: [{
                        color: "#FF0000",
                        weight: 3,
                        opacity: 0.7
                    }]
                },
                routeWhileDragging: true,
                draggableWaypoints: true,
                addWaypoints: false,
                showAlternatives: false,
                fitSelectedRoutes: true,
                show: true,
                geocoder: L.Control.Geocoder.nominatim(),
                createMarker: () => null,
            });
            control?.addTo(mapRef?.current);
            routingControlRef.current = control;

            const routingContainer = document.querySelector(".leaflet-routing-container");
            if (routingContainer) {
                routingContainer.classList.add(styles.routingControls)
            }
        }

        return () => {
            if (routingControlRef.current && mapRef.current) {
                mapRef.current.removeControl(routingControlRef.current);
            }
        };
    }, [clientLocation, nearestStation]);

    if (!clientLocation || !nearestStation) return <div className="w-full h-full flex items-center justify-center">Loading map...</div>;

    return (
        <div className="w-full h-full relative">
            <MapContainer
                center={[clientLocation.lat, clientLocation.lng]}
                zoom={13}
                scrollWheelZoom={true}
                ref={mapRef}
                className={`w-full h-full ${styles.MapComponent}`}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={[clientLocation.lat, clientLocation.lng]} icon={destinationIcon}>
                    <Popup>Emergency Location</Popup>
                </Marker>

                {nearestStation && (
                    <Marker
                        position={[nearestStation.located_at.lat, nearestStation.located_at.lng]}
                        icon={customIcon}
                    >
                        <Popup>
                            <div className="text-sm">
                                <strong>Police Station</strong>
                                <br />
                                Distance: {nearestStation.distance} km
                                <br />
                                Location : {nearestStation.located_at.location}
                            </div>
                        </Popup>
                    </Marker>
                )}


                {policeStations.filter(each => each.located_at !== nearestStation.located_at).map((station, index) => (
                    <Marker
                        key={index}
                        position={[station.located_at.lat, station.located_at.lng]}
                        icon={customIcon}
                    >
                        <Popup>Police Station {station.located_at.location}</Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
