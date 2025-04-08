'use client';

import { useEffect, useRef, useState } from 'react';
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
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!mapRef.current) return;

        // Initialize map if it doesn't exist
        if (!leafletMap.current) {
            // Set loading state
            setIsLoading(true);

            // Create map with dark theme
            leafletMap.current = L.map(mapRef.current, {
                zoomControl: false, // We'll add zoom control in a better position
                attributionControl: false, // We'll add attribution in a better way
            }).setView([0, 0], 2);

            // Add better looking tile layer (Mapbox or CartoDB)
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20,
            }).addTo(leafletMap.current);

            // Add zoom control to bottom right
            L.control.zoom({
                position: 'bottomright'
            }).addTo(leafletMap.current);

            // Add scale control
            L.control.scale({
                imperial: false,
                position: 'bottomleft'
            }).addTo(leafletMap.current);

            // Add attribution in a better position
            L.control.attribution({
                position: 'bottomright',
                prefix: false
            }).addTo(leafletMap.current);
        }

        // End loading after map initialization
        setTimeout(() => setIsLoading(false), 500);

        // Clear previous layers
        leafletMap.current.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) return; // Keep the base map
            layer.remove();
        });

        if (!route) return;

        const map = leafletMap.current;
        const bounds = new L.LatLngBounds([]);

        // Add origin and destination markers with improved icons
        const originIcon = L.divIcon({
            html: `<div class="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white font-bold text-sm shadow-md border-2 border-white">DEP</div>`,
            className: 'custom-div-icon',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
        });

        const destIcon = L.divIcon({
            html: `<div class="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white font-bold text-sm shadow-md border-2 border-white">ARR</div>`,
            className: 'custom-div-icon',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
        });

        // Add origin marker with pulsing effect
        const originMarker = L.marker([route.origin.lat, route.origin.lng], { icon: originIcon })
            .addTo(map)
            .bindPopup(createAirportPopup(route.origin.icao, 'Origem'), {
                className: 'custom-popup',
                autoPan: true,
            });
        bounds.extend([route.origin.lat, route.origin.lng]);

        // Add destination marker
        const destMarker = L.marker([route.destination.lat, route.destination.lng], { icon: destIcon })
            .addTo(map)
            .bindPopup(createAirportPopup(route.destination.icao, 'Destino'), {
                className: 'custom-popup',
                autoPan: true,
            });
        bounds.extend([route.destination.lat, route.destination.lng]);

        // Add waypoint markers
        if (route.waypoints && route.waypoints.length > 0) {
            route.waypoints.forEach((waypoint) => {
                const waypointIcon = getWaypointIcon(waypoint.type);

                L.marker([waypoint.lat, waypoint.lng], { icon: waypointIcon })
                    .addTo(map)
                    .bindPopup(createWaypointPopup(waypoint.name, getWaypointTypeName(waypoint.type)), {
                        className: 'custom-popup',
                        autoPan: true,
                    });

                bounds.extend([waypoint.lat, waypoint.lng]);
            });
        }

        // Add airways with gradient color
        if (route.airways && route.airways.length > 0) {
            route.airways.forEach((airway, index) => {
                if (airway.points.length > 1) {
                    // Create gradient polyline
                    const polyline = L.polyline(airway.points, {
                        color: getAirwayColor(index, route.airways.length),
                        weight: 4,
                        opacity: 0.8,
                        smoothFactor: 1,
                        lineCap: 'round',
                    }).addTo(map);

                    // Animate the airway on load
                    const pathLength = (polyline.getElement() as SVGPathElement)?.getTotalLength() || 0;
                    animateAirway(polyline, pathLength);

                    // Add hover effect
                    polyline.on('mouseover', function () {
                        polyline.setStyle({ weight: 6, opacity: 1.0 });
                    });
                    polyline.on('mouseout', function () {
                        polyline.setStyle({ weight: 4, opacity: 0.8 });
                    });

                    // Add airway name
                    const midpoint = getMidpoint(airway.points);

                    L.marker(midpoint, {
                        icon: L.divIcon({
                            html: `<div class="px-2 py-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded text-xs font-medium shadow-sm">${airway.name}</div>`,
                            className: 'airway-label',
                        })
                    }).addTo(map);

                    // Extend bounds with all points
                    airway.points.forEach(point => bounds.extend(point));
                }
            });
        }

        // Draw direct route line if no airways
        if (!route.airways || route.airways.length === 0) {
            const polyline = L.polyline(
                [
                    [route.origin.lat, route.origin.lng],
                    [route.destination.lat, route.destination.lng],
                ],
                {
                    color: '#3b82f6',
                    weight: 4,
                    opacity: 0.8,
                    lineCap: 'round',
                    lineJoin: 'round',
                    dashArray: '10, 10',
                }
            ).addTo(map);

            // Add hover effect
            polyline.on('mouseover', function () {
                polyline.setStyle({ weight: 6, opacity: 1.0 });
            });
            polyline.on('mouseout', function () {
                polyline.setStyle({ weight: 4, opacity: 0.8 });
            });

            // Add distance label
            const midpoint = [
                (route.origin.lat + route.destination.lat) / 2,
                (route.origin.lng + route.destination.lng) / 2
            ];

            // Calculate distance in nautical miles
            const distance = calculateDistance(
                route.origin.lat, route.origin.lng,
                route.destination.lat, route.destination.lng
            ).toFixed(0);

            L.marker(midpoint as [number, number], {
                icon: L.divIcon({
                    html: `<div class="px-2 py-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded text-xs font-medium shadow-sm">${distance} NM</div>`,
                    className: 'distance-label',
                })
            }).addTo(map);
        }

        // Fit map to bounds with nice padding and animation
        if (bounds.isValid()) {
            map.fitBounds(bounds, {
                padding: [70, 70],
                animate: true,
                duration: 1.0
            });
        }

        return () => {
            // Cleanup function
        };
    }, [route]);

    return (
        <div className="w-full h-[500px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg relative">
            {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600 dark:text-gray-300 font-medium">Carregando mapa...</p>
                    </div>
                </div>
            )}

            {!route ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 p-6">
                    <div className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-center">Gere uma rota para visualizar no mapa</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 text-center">Insira os aeroportos de origem e destino para começar</p>
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
            html = `<div class="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white text-xs shadow-md border border-white">FIX</div>`;
            break;
        case 'navaid':
            html = `<div class="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-white text-xs shadow-md border border-white">NAV</div>`;
            break;
        case 'airport':
            html = `<div class="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white text-xs shadow-md border border-white">APT</div>`;
            break;
    }

    return L.divIcon({
        html,
        className,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
    });
}

function getWaypointTypeName(type: 'fix' | 'navaid' | 'airport'): string {
    switch (type) {
        case 'fix': return 'Fixo';
        case 'navaid': return 'Auxílio à Navegação';
        case 'airport': return 'Aeroporto';
    }
}

// Create attractive popups for airports
function createAirportPopup(icao: string, type: string): string {
    return `
        <div class="p-1">
            <div class="font-bold text-lg">${icao}</div>
            <div class="text-sm text-gray-600">${type}</div>
        </div>
    `;
}

// Create attractive popups for waypoints
function createWaypointPopup(name: string, type: string): string {
    return `
        <div class="p-1">
            <div class="font-bold">${name}</div>
            <div class="text-xs text-gray-600">${type}</div>
        </div>
    `;
}

// Get a color from a gradient based on the index
function getAirwayColor(index: number, total: number): string {
    const colors = [
        '#3b82f6', // Blue
        '#8b5cf6', // Indigo
        '#ec4899', // Pink
        '#f97316', // Orange
        '#10b981'  // Emerald
    ];

    return colors[index % colors.length];
}

// Get midpoint of a polyline for label placement
function getMidpoint(points: Array<[number, number]>): [number, number] {
    if (points.length === 0) return [0, 0];
    if (points.length === 1) return points[0];

    const midIndex = Math.floor(points.length / 2);
    return points[midIndex];
}

// Add animation to airway lines
function animateAirway(polyline: L.Polyline, pathLength: number) {
    const path = polyline.getElement() as SVGElement;
    if (!path) return;

    path.classList.add('animated-path');
    path.style.strokeDasharray = `${pathLength}`;
    path.style.strokeDashoffset = `${pathLength}`;
    path.style.animation = `dash 1.5s ease-in-out forwards`;
    path.style.animationDelay = '0.2s';
}

// Calculate distance between two points in nautical miles
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d * 0.539957; // Convert to nautical miles
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}