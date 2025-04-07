import { NextRequest, NextResponse } from 'next/server';
import { Route, Waypoint, Airway, Airport } from '@/types';

// Dados simulados de aeroportos (mesmos da API de aeroportos)
const airports: Record<string, Airport> = {
    'SBGR': {
        icao: 'SBGR',
        name: 'Aeroporto Internacional de São Paulo/Guarulhos',
        lat: -23.4356,
        lng: -46.4731,
        elevation: 750,
        country: 'Brasil',
        city: 'Guarulhos'
    },
    'SBRJ': {
        icao: 'SBRJ',
        name: 'Aeroporto Santos Dumont',
        lat: -22.9111,
        lng: -43.1631,
        elevation: 3,
        country: 'Brasil',
        city: 'Rio de Janeiro'
    },
    'SBSP': {
        icao: 'SBSP',
        name: 'Aeroporto de Congonhas',
        lat: -23.6261,
        lng: -46.6564,
        elevation: 802,
        country: 'Brasil',
        city: 'São Paulo'
    },
    'SBGL': {
        icao: 'SBGL',
        name: 'Aeroporto Internacional do Rio de Janeiro/Galeão',
        lat: -22.8089,
        lng: -43.2436,
        elevation: 28,
        country: 'Brasil',
        city: 'Rio de Janeiro'
    },
    'SBBR': {
        icao: 'SBBR',
        name: 'Aeroporto Internacional de Brasília',
        lat: -15.8711,
        lng: -47.9186,
        elevation: 1060,
        country: 'Brasil',
        city: 'Brasília'
    },
    'SBCF': {
        icao: 'SBCF',
        name: 'Aeroporto Internacional de Belo Horizonte/Confins',
        lat: -19.6336,
        lng: -43.9686,
        elevation: 827,
        country: 'Brasil',
        city: 'Confins'
    },
    'SBPA': {
        icao: 'SBPA',
        name: 'Aeroporto Internacional de Porto Alegre',
        lat: -29.9939,
        lng: -51.1711,
        elevation: 3,
        country: 'Brasil',
        city: 'Porto Alegre'
    },
    'SBRF': {
        icao: 'SBRF',
        name: 'Aeroporto Internacional do Recife/Guararapes',
        lat: -8.1264,
        lng: -34.9236,
        elevation: 10,
        country: 'Brasil',
        city: 'Recife'
    },
    'SBSV': {
        icao: 'SBSV',
        name: 'Aeroporto Internacional de Salvador',
        lat: -12.9086,
        lng: -38.3225,
        elevation: 20,
        country: 'Brasil',
        city: 'Salvador'
    },
    'SBFL': {
        icao: 'SBFL',
        name: 'Aeroporto Internacional de Florianópolis',
        lat: -27.6703,
        lng: -48.5478,
        elevation: 5,
        country: 'Brasil',
        city: 'Florianópolis'
    }
};

// Dados simulados de fixos de navegação
const fixes: Record<string, { name: string; lat: number; lng: number }> = {
    'AMBET': { name: 'AMBET', lat: -23.1500, lng: -45.8333 },
    'DORLU': { name: 'DORLU', lat: -22.7833, lng: -44.5833 },
    'GIKPO': { name: 'GIKPO', lat: -22.6167, lng: -44.0000 },
    'MABSI': { name: 'MABSI', lat: -22.4500, lng: -43.5000 },
    'KEBLE': { name: 'KEBLE', lat: -23.0000, lng: -46.0000 },
    'UVUPU': { name: 'UVUPU', lat: -22.8333, lng: -45.5000 },
    'POSGA': { name: 'POSGA', lat: -22.6667, lng: -45.0000 },
    'RUXER': { name: 'RUXER', lat: -22.5000, lng: -44.5000 },
    'NAXOV': { name: 'NAXOV', lat: -22.3333, lng: -44.0000 },
    'BOBKI': { name: 'BOBKI', lat: -22.1667, lng: -43.5000 }
};

// Dados simulados de auxílios à navegação
const navaids: Record<string, { name: string; lat: number; lng: number }> = {
    'GRU': { name: 'GRU', lat: -23.4356, lng: -46.4731 },
    'SDU': { name: 'SDU', lat: -22.9111, lng: -43.1631 },
    'CGH': { name: 'CGH', lat: -23.6261, lng: -46.6564 },
    'GIG': { name: 'GIG', lat: -22.8089, lng: -43.2436 },
    'BSB': { name: 'BSB', lat: -15.8711, lng: -47.9186 }
};

// Dados simulados de aerovias
const airways: Record<string, { name: string; points: Array<string> }> = {
    'UZ1': {
        name: 'UZ1',
        points: ['AMBET', 'DORLU', 'GIKPO', 'MABSI']
    },
    'UZ2': {
        name: 'UZ2',
        points: ['KEBLE', 'UVUPU', 'POSGA', 'RUXER', 'NAXOV', 'BOBKI']
    },
    'UZ3': {
        name: 'UZ3',
        points: ['AMBET', 'KEBLE', 'UVUPU', 'DORLU']
    },
    'UZ4': {
        name: 'UZ4',
        points: ['POSGA', 'GIKPO', 'RUXER', 'NAXOV', 'MABSI', 'BOBKI']
    }
};

// Função para calcular a distância entre dois pontos em coordenadas geográficas (fórmula de Haversine)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3440.065; // Raio da Terra em milhas náuticas
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Função para calcular o tempo estimado de voo com base na distância
function calculateEstimatedTime(distance: number): string {
    // Assumindo uma velocidade média de 450 nós
    const speedKnots = 450;
    const timeHours = distance / speedKnots;

    const hours = Math.floor(timeHours);
    const minutes = Math.floor((timeHours - hours) * 60);

    return `${hours}h ${minutes}min`;
}

// Função para gerar uma rota entre dois aeroportos
async function generateFlightRoute(originIcao: string, destinationIcao: string): Promise<Route> {
    // Verifica se os aeroportos existem
    if (!airports[originIcao]) {
        throw new Error(`Aeroporto de origem ${originIcao} não encontrado`);
    }

    if (!airports[destinationIcao]) {
        throw new Error(`Aeroporto de destino ${destinationIcao} não encontrado`);
    }

    const origin = airports[originIcao];
    const destination = airports[destinationIcao];

    // Calcula a distância direta entre origem e destino
    const directDistance = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng);

    // Simula um pequeno atraso para simular processamento
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Gera waypoints para a rota
    // Para este exemplo, vamos selecionar alguns fixos e navaids aleatórios
    const waypointsCount = Math.floor(Math.random() * 4) + 2; // 2 a 5 waypoints
    const selectedWaypoints: Waypoint[] = [];

    // Seleciona uma aerovia aleatória para usar
    const airwayKeys = Object.keys(airways);
    const selectedAirwayKey = airwayKeys[Math.floor(Math.random() * airwayKeys.length)];
    const selectedAirway = airways[selectedAirwayKey];

    // Adiciona waypoints da aerovia selecionada
    for (const pointName of selectedAirway.points) {
        if (fixes[pointName]) {
            selectedWaypoints.push({
                name: pointName,
                lat: fixes[pointName].lat,
                lng: fixes[pointName].lng,
                type: 'fix',
                airway: selectedAirway.name
            });
        }
    }

    // Adiciona um navaid aleatório
    const navaidKeys = Object.keys(navaids);
    const selectedNavaidKey = navaidKeys[Math.floor(Math.random() * navaidKeys.length)];
    const selectedNavaid = navaids[selectedNavaidKey];

    selectedWaypoints.push({
        name: selectedNavaid.name,
        lat: selectedNavaid.lat,
        lng: selectedNavaid.lng,
        type: 'navaid'
    });

    // Calcula a distância total da rota através dos waypoints
    let totalDistance = 0;
    let lastPoint = { lat: origin.lat, lng: origin.lng };

    for (const waypoint of selectedWaypoints) {
        totalDistance += calculateDistance(lastPoint.lat, lastPoint.lng, waypoint.lat, waypoint.lng);
        lastPoint = { lat: waypoint.lat, lng: waypoint.lng };
    }

    // Adiciona a distância do último waypoint ao destino
    totalDistance += calculateDistance(lastPoint.lat, lastPoint.lng, destination.lat, destination.lng);

    // Gera as aerovias para a rota
    const routeAirways: Airway[] = [];

    // Adiciona a aerovia selecionada
    const airwayPoints: Array<[number, number]> = [];
    for (const pointName of selectedAirway.points) {
        if (fixes[pointName]) {
            airwayPoints.push([fixes[pointName].lat, fixes[pointName].lng]);
        }
    }

    routeAirways.push({
        name: selectedAirway.name,
        from: selectedAirway.points[0],
        to: selectedAirway.points[selectedAirway.points.length - 1],
        points: airwayPoints,
        distance: calculateDistance(
            fixes[selectedAirway.points[0]].lat,
            fixes[selectedAirway.points[0]].lng,
            fixes[selectedAirway.points[selectedAirway.points.length - 1]].lat,
            fixes[selectedAirway.points[selectedAirway.points.length - 1]].lng
        )
    });

    // Retorna a rota gerada
    return {
        origin: {
            icao: origin.icao,
            name: origin.name,
            lat: origin.lat,
            lng: origin.lng
        },
        destination: {
            icao: destination.icao,
            name: destination.name,
            lat: destination.lat,
            lng: destination.lng
        },
        distance: totalDistance,
        estimatedTime: calculateEstimatedTime(totalDistance),
        waypoints: selectedWaypoints,
        airways: routeAirways
    };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { origin, destination } = body;

        if (!origin || !destination) {
            return NextResponse.json(
                { error: 'Origem e destino são obrigatórios' },
                { status: 400 }
            );
        }

        if (origin.length !== 4 || destination.length !== 4) {
            return NextResponse.json(
                { error: 'Códigos ICAO inválidos. Devem ter 4 caracteres.' },
                { status: 400 }
            );
        }

        const route = await generateFlightRoute(origin.toUpperCase(), destination.toUpperCase());

        return NextResponse.json(route);
    } catch (error) {
        console.error('Erro ao gerar rota:', error);
        return NextResponse.json(
            { error: 'Erro ao gerar rota' },
            { status: 500 }
        );
    }
}