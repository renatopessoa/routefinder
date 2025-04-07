'use client';

import { useState } from 'react';
import { RouteForm } from '@/components/RouteForm';
import { RouteDetails } from '@/components/RouteDetails';
import { RouteMap } from '@/components/RouteMap';
import { MetarInfo } from '@/components/MetarInfo';
import { generateRoute, fetchMetar } from '@/services/api';
import { Route, MetarData } from '@/types';

export default function Home() {
  const [route, setRoute] = useState<Route | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [originMetar, setOriginMetar] = useState<MetarData | null>(null);
  const [destinationMetar, setDestinationMetar] = useState<MetarData | null>(null);
  const [isLoadingMetar, setIsLoadingMetar] = useState(false);

  const handleGenerateRoute = async (origin: string, destination: string) => {
    setIsLoading(true);
    try {
      const routeData = await generateRoute(origin, destination);
      setRoute(routeData);

      // Após gerar a rota, buscar os METARs
      fetchMetarData(origin, destination);
    } catch (error) {
      console.error('Erro ao gerar rota:', error);
      // Aqui poderia adicionar uma notificação de erro para o usuário
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMetarData = async (origin: string, destination: string) => {
    setIsLoadingMetar(true);
    try {
      const [originData, destinationData] = await Promise.all([
        fetchMetar(origin),
        fetchMetar(destination)
      ]);

      setOriginMetar(originData);
      setDestinationMetar(destinationData);
    } catch (error) {
      console.error('Erro ao buscar dados METAR:', error);
    } finally {
      setIsLoadingMetar(false);
    }
  };

  return (
    <div className="min-h-screen bg-ios-gray-50 dark:bg-ios-gray-950 p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-ios-blue mb-2">✈️ Gerador de Rotas Aéreas</h1>
        <p className="text-ios-gray-600 dark:text-ios-gray-400">
          Planeje sua rota com informações meteorológicas em tempo real
        </p>
      </header>

      <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-1">
          <RouteForm onSubmit={handleGenerateRoute} isLoading={isLoading} />

          {route && (
            <div className="mt-6">
              <RouteDetails route={route} isLoading={isLoading} />
            </div>
          )}
        </div>

        <div className="md:col-span-1 lg:col-span-2">
          {route ? (
            <div className="h-[400px] md:h-[500px] bg-white dark:bg-ios-gray-900 rounded-ios-lg border border-ios-gray-200 dark:border-ios-gray-700 shadow-ios overflow-hidden">
              <RouteMap route={route} />
            </div>
          ) : (
            <div className="h-[400px] md:h-[500px] bg-white dark:bg-ios-gray-900 rounded-ios-lg border border-ios-gray-200 dark:border-ios-gray-700 shadow-ios flex items-center justify-center">
              <p className="text-ios-gray-500">Selecione origem e destino para visualizar a rota</p>
            </div>
          )}
        </div>
      </div>

      {route && (
        <div className="mt-8 max-w-7xl mx-auto grid gap-6 md:grid-cols-2">
          <MetarInfo
            data={originMetar}
            isLoading={isLoadingMetar}
            title="METAR Origem"
          />
          <MetarInfo
            data={destinationMetar}
            isLoading={isLoadingMetar}
            title="METAR Destino"
          />
        </div>
      )}
    </div>
  );
}
