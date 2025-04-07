'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface RouteMapProps {
    route: {
        origin: {
            icao: string;
            lat: number;
            lng: number;
        };
        destination: {
            icao: string;
            lat: number;
            lng: number;
        };
        waypoints: Array<{
            name: string;
            lat: number;
            lng: number;
            type: 'fix' | 'navaid' | 'airport';
        }>;
        airways: Array<{
            name: string;
            points: Array<[number, number]>;
        }>;
    } | null;
}

export function RouteMap({ route }: RouteMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMap = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        // Initialize map if it doesn't exist
        if (!leafletMap.current) {
            leafletMap.current = L.map(mapRef.current).setView([0, 0], 2);

            // Add tile layer (map style)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18,
            }).addTo(leafletMap.current);
        }

        // Clear previous layers
        leafletMap.current.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) return; // Keep the base map
            layer.remove();
        });

        if (!route) return;

        const map = leafletMap.current;
        const bounds = new L.LatLngBounds([]);

        // Add origin and destination markers
        const originIcon = L.divIcon({
            html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-ios-green text-white font-bold">O</div>`,
            className: 'custom-div-icon',
        });

        const destIcon = L.divIcon({
            html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-ios-red text-white font-bold">D</div>`,
            className: 'custom-div-icon',
        });

        // Add origin marker
        L.marker([route.origin.lat, route.origin.lng], { icon: originIcon })
            .addTo(map)
            .bindPopup(`<b>${route.origin.icao}</b><br>Origem`);
        bounds.extend([route.origin.lat, route.origin.lng]);

        // Add destination marker
        L.marker([route.destination.lat, route.destination.lng], { icon: destIcon })
            .addTo(map)
            .bindPopup(`<b>${route.destination.icao}</b><br>Destino`);
        bounds.extend([route.destination.lat, route.destination.lng]);

        // Add waypoint markers
        if (route.waypoints && route.waypoints.length > 0) {
            route.waypoints.forEach((waypoint) => {
                const waypointIcon = getWaypointIcon(waypoint.type);

                L.marker([waypoint.lat, waypoint.lng], { icon: waypointIcon })
                    .addTo(map)
                    .bindPopup(`<b>${waypoint.name}</b><br>${getWaypointTypeName(waypoint.type)}`);

                bounds.extend([waypoint.lat, waypoint.lng]);
            });
        }

        // Add airways
        if (route.airways && route.airways.length > 0) {
            route.airways.forEach((airway) => {
                if (airway.points.length > 1) {
                    const polyline = L.polyline(airway.points, {
                        color: '#007AFF',
                        weight: 3,
                        opacity: 0.7,
                        dashArray: '5, 5',
                    }).addTo(map);

                    polyline.bindTooltip(airway.name, {
                        permanent: true,
                        direction: 'center',
                        className: 'airway-label',
                    });

                    // Extend bounds with all points
                    airway.points.forEach(point => bounds.extend(point));
                }
            });
        }

        // Draw direct route line if no airways
        if (!route.airways || route.airways.length === 0) {
            L.polyline(
                [
                    [route.origin.lat, route.origin.lng],
                    [route.destination.lat, route.destination.lng],
                ],
                {
                    color: '#007AFF',
                    weight: 3,
                    opacity: 0.7,
                }
            ).addTo(map);
        }

        // Fit map to bounds
        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }

        return () => {
            // Cleanup function
        };
    }, [route]);

    return (
        <div className="w-full h-[500px] rounded-ios-lg overflow-hidden border border-ios-gray-200 dark:border-ios-gray-700 shadow-ios">
            {!route ? (
                <div className="w-full h-full flex items-center justify-center bg-ios-gray-100 dark:bg-ios-gray-800">
                    <p className="text-ios-gray-500">Gere uma rota para visualizar no mapa</p>
                </div>
            ) : (
                <div ref={mapRef} className="w-full h-full" />
            )}
        </div>
    );
}

function getWaypointIcon(type: 'fix' | 'navaid' | 'airport'): L.DivIcon {
    let html = '';
    let className = 'custom-div-icon';

    switch (type) {
        case 'fix':
            html = `<div class="flex items-center justify-center w-6 h-6 rounded-full bg-ios-blue text-white text-xs">F</div>`;
            break;
        case 'navaid':
            html = `<div class="flex items-center justify-center w-6 h-6 rounded-full bg-ios-purple text-white text-xs">N</div>`;
            break;
        case 'airport':
            html = `<div class="flex items-center justify-center w-6 h-6 rounded-full bg-ios-orange text-white text-xs">A</div>`;
            break;
    }

    return L.divIcon({ html, className });
}

function getWaypointTypeName(type: 'fix' | 'navaid' | 'airport'): string {
    switch (type) {
        case 'fix': return 'Fixo';
        case 'navaid': return 'Auxílio à Navegação';
        case 'airport': return 'Aeroporto';
    }
}