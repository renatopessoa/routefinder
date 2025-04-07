import { NextRequest, NextResponse } from 'next/server';
import { MetarData } from '@/types';

// Função para buscar dados METAR de uma fonte externa
// Em produção, isso seria substituído por uma integração real com NOAA/AVWX
async function fetchMetarFromSource(icao: string): Promise<MetarData> {
    // Simulação de dados METAR para desenvolvimento
    // Em produção, isso seria substituído por uma chamada real à API METAR

    // Simula um pequeno atraso para simular uma chamada de rede
    await new Promise(resolve => setTimeout(resolve, 500));

    // Dados simulados baseados no ICAO
    const simulatedData: Record<string, MetarData> = {
        'SBGR': {
            icao: 'SBGR',
            raw: 'SBGR 221700Z 09008KT 9999 FEW035 SCT300 28/16 Q1016',
            temperature: 28,
            dewpoint: 16,
            wind: {
                direction: 90,
                speed: 8,
                unit: 'KT'
            },
            visibility: {
                distance: 9999,
                unit: 'm'
            },
            clouds: [
                { cover: 'FEW', altitude: 35 },
                { cover: 'SCT', altitude: 300 }
            ],
            barometer: {
                hg: 30.00,
                hpa: 1016
            },
            flight_category: 'VFR'
        },
        'SBRJ': {
            icao: 'SBRJ',
            raw: 'SBRJ 221700Z 14005KT 8000 FEW015 BKN025 25/20 Q1015',
            temperature: 25,
            dewpoint: 20,
            wind: {
                direction: 140,
                speed: 5,
                unit: 'KT'
            },
            visibility: {
                distance: 8000,
                unit: 'm'
            },
            clouds: [
                { cover: 'FEW', altitude: 15 },
                { cover: 'BKN', altitude: 25 }
            ],
            barometer: {
                hg: 29.97,
                hpa: 1015
            },
            flight_category: 'VFR'
        },
        'SBSP': {
            icao: 'SBSP',
            raw: 'SBSP 221700Z 27006KT 6000 SCT008 BKN015 22/19 Q1014',
            temperature: 22,
            dewpoint: 19,
            wind: {
                direction: 270,
                speed: 6,
                unit: 'KT'
            },
            visibility: {
                distance: 6000,
                unit: 'm'
            },
            clouds: [
                { cover: 'SCT', altitude: 8 },
                { cover: 'BKN', altitude: 15 }
            ],
            barometer: {
                hg: 29.94,
                hpa: 1014
            },
            flight_category: 'MVFR'
        },
        'SBGL': {
            icao: 'SBGL',
            raw: 'SBGL 221700Z 12010KT 9999 FEW020 SCT035 27/18 Q1015',
            temperature: 27,
            dewpoint: 18,
            wind: {
                direction: 120,
                speed: 10,
                unit: 'KT'
            },
            visibility: {
                distance: 9999,
                unit: 'm'
            },
            clouds: [
                { cover: 'FEW', altitude: 20 },
                { cover: 'SCT', altitude: 35 }
            ],
            barometer: {
                hg: 29.97,
                hpa: 1015
            },
            flight_category: 'VFR'
        }
    };

    // Retorna dados simulados ou um erro se o ICAO não for encontrado
    if (simulatedData[icao.toUpperCase()]) {
        return simulatedData[icao.toUpperCase()];
    }

    // Gera dados aleatórios para ICAOs não conhecidos
    return {
        icao: icao.toUpperCase(),
        raw: `${icao.toUpperCase()} 221700Z ${Math.floor(Math.random() * 36)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}KT ${Math.floor(Math.random() * 10)}000 FEW0${Math.floor(Math.random() * 4)}0 SCT0${Math.floor(Math.random() * 4)}0 ${Math.floor(Math.random() * 10) + 20}/${Math.floor(Math.random() * 10) + 15} Q10${Math.floor(Math.random() * 3) + 14}`,
        temperature: Math.floor(Math.random() * 10) + 20,
        dewpoint: Math.floor(Math.random() * 10) + 15,
        wind: {
            direction: Math.floor(Math.random() * 360),
            speed: Math.floor(Math.random() * 15) + 5,
            unit: 'KT'
        },
        visibility: {
            distance: Math.floor(Math.random() * 5) * 1000 + 5000,
            unit: 'm'
        },
        clouds: [
            { cover: 'FEW', altitude: Math.floor(Math.random() * 40) + 10 },
            { cover: 'SCT', altitude: Math.floor(Math.random() * 40) + 50 }
        ],
        barometer: {
            hg: 29.92 + (Math.random() * 0.2 - 0.1),
            hpa: 1014 + Math.floor(Math.random() * 6 - 3)
        },
        flight_category: ['VFR', 'MVFR', 'IFR'][Math.floor(Math.random() * 3)]
    };
}

export async function GET(
    request: NextRequest,
    { params }: { params: { icao: string } }
) {
    try {
        const { icao } = params;

        if (!icao || icao.length !== 4) {
            return NextResponse.json(
                { error: 'Código ICAO inválido. Deve ter 4 caracteres.' },
                { status: 400 }
            );
        }

        const metarData = await fetchMetarFromSource(icao);

        return NextResponse.json(metarData);
    } catch (error) {
        console.error('Erro ao buscar dados METAR:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar dados METAR' },
            { status: 500 }
        );
    }
}