import { MetarData, Route, Airport } from '@/types';

// URL base para a API (em produção, seria substituída por uma URL real)
const API_BASE_URL = '/api';

/**
 * Busca dados METAR para um aeroporto específico
 * @param icao Código ICAO do aeroporto
 */
export async function fetchMetar(icao: string): Promise<MetarData> {
    try {
        const response = await fetch(`${API_BASE_URL}/metar/${icao}`);

        if (!response.ok) {
            throw new Error(`Erro ao buscar METAR: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar dados METAR:', error);
        throw error;
    }
}

/**
 * Busca aeroportos com base em um termo de pesquisa
 * @param query Termo de pesquisa (código ICAO ou nome do aeroporto)
 */
export async function searchAirports(query: string): Promise<Airport[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/airports?q=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error(`Erro ao buscar aeroportos: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar aeroportos:', error);
        throw error;
    }
}

/**
 * Gera uma rota entre dois aeroportos
 * @param origin Código ICAO do aeroporto de origem
 * @param destination Código ICAO do aeroporto de destino
 */
export async function generateRoute(origin: string, destination: string): Promise<Route> {
    try {
        const response = await fetch(`${API_BASE_URL}/generate-route`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ origin, destination }),
        });

        if (!response.ok) {
            throw new Error(`Erro ao gerar rota: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao gerar rota:', error);
        throw error;
    }
}