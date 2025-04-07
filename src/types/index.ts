// Tipos para METAR
export interface MetarData {
    icao: string;
    raw: string;
    temperature?: number;
    dewpoint?: number;
    wind?: {
        direction: number;
        speed: number;
        gust?: number;
        unit: string;
    };
    visibility?: {
        distance: number;
        unit: string;
    };
    clouds?: Array<{
        cover: string;
        altitude: number;
    }>;
    humidity?: number;
    barometer?: {
        hg: number;
        hpa: number;
    };
    flight_category?: string;
}

// Tipos para Aeroportos
export interface Airport {
    icao: string;
    name: string;
    lat: number;
    lng: number;
    elevation?: number;
    country?: string;
    city?: string;
}

// Tipos para Waypoints
export type WaypointType = 'fix' | 'navaid' | 'airport';

export interface Waypoint {
    name: string;
    lat: number;
    lng: number;
    type: WaypointType;
    airway?: string;
}

// Tipos para Aerovias
export interface Airway {
    name: string;
    from: string;
    to: string;
    points: Array<[number, number]>;
    distance?: number;
}

// Tipo para Rota
export interface Route {
    origin: {
        icao: string;
        name?: string;
        lat: number;
        lng: number;
    };
    destination: {
        icao: string;
        name?: string;
        lat: number;
        lng: number;
    };
    distance?: number;
    estimatedTime?: string;
    waypoints: Waypoint[];
    airways: Airway[];
}