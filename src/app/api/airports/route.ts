import { NextRequest, NextResponse } from 'next/server';
import { Airport } from '@/types';

// Dados simulados de aeroportos para desenvolvimento
// Em produção, isso seria substituído por um banco de dados real
const airports: Airport[] = [
    {
        icao: 'SBGR',
        name: 'Aeroporto Internacional de São Paulo/Guarulhos',
        lat: -23.4356,
        lng: -46.4731,
        elevation: 750,
        country: 'Brasil',
        city: 'Guarulhos'
    },
    {
        icao: 'SBRJ',
        name: 'Aeroporto Santos Dumont',
        lat: -22.9111,
        lng: -43.1631,
        elevation: 3,
        country: 'Brasil',
        city: 'Rio de Janeiro'
    },
    {
        icao: 'SBSP',
        name: 'Aeroporto de Congonhas',
        lat: -23.6261,
        lng: -46.6564,
        elevation: 802,
        country: 'Brasil',
        city: 'São Paulo'
    },
    {
        icao: 'SBGL',
        name: 'Aeroporto Internacional do Rio de Janeiro/Galeão',
        lat: -22.8089,
        lng: -43.2436,
        elevation: 28,
        country: 'Brasil',
        city: 'Rio de Janeiro'
    },
    {
        icao: 'SBBR',
        name: 'Aeroporto Internacional de Brasília',
        lat: -15.8711,
        lng: -47.9186,
        elevation: 1060,
        country: 'Brasil',
        city: 'Brasília'
    },
    {
        icao: 'SBCF',
        name: 'Aeroporto Internacional de Belo Horizonte/Confins',
        lat: -19.6336,
        lng: -43.9686,
        elevation: 827,
        country: 'Brasil',
        city: 'Confins'
    },
    {
        icao: 'SBPA',
        name: 'Aeroporto Internacional de Porto Alegre',
        lat: -29.9939,
        lng: -51.1711,
        elevation: 3,
        country: 'Brasil',
        city: 'Porto Alegre'
    },
    {
        icao: 'SBRF',
        name: 'Aeroporto Internacional do Recife/Guararapes',
        lat: -8.1264,
        lng: -34.9236,
        elevation: 10,
        country: 'Brasil',
        city: 'Recife'
    },
    {
        icao: 'SBSV',
        name: 'Aeroporto Internacional de Salvador',
        lat: -12.9086,
        lng: -38.3225,
        elevation: 20,
        country: 'Brasil',
        city: 'Salvador'
    },
    {
        icao: 'SBFL',
        name: 'Aeroporto Internacional de Florianópolis',
        lat: -27.6703,
        lng: -48.5478,
        elevation: 5,
        country: 'Brasil',
        city: 'Florianópolis'
    }
];

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q');

        if (!query) {
            // Se não houver consulta, retorna todos os aeroportos (limitado a 10 para este exemplo)
            return NextResponse.json(airports.slice(0, 10));
        }

        // Filtra aeroportos com base na consulta (ICAO ou nome)
        const filteredAirports = airports.filter(airport => {
            const icaoMatch = airport.icao.toLowerCase().includes(query.toLowerCase());
            const nameMatch = airport.name.toLowerCase().includes(query.toLowerCase());
            const cityMatch = airport.city?.toLowerCase().includes(query.toLowerCase());

            return icaoMatch || nameMatch || cityMatch;
        });

        return NextResponse.json(filteredAirports);
    } catch (error) {
        console.error('Erro ao buscar aeroportos:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar aeroportos' },
            { status: 500 }
        );
    }
}