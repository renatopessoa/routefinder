'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface RouteDetailsProps {
    route: {
        origin: {
            icao: string;
            name?: string;
        };
        destination: {
            icao: string;
            name?: string;
        };
        distance?: number;
        estimatedTime?: string;
        waypoints: Array<{
            name: string;
            type: 'fix' | 'navaid' | 'airport';
            airway?: string;
        }>;
        airways: Array<{
            name: string;
            from: string;
            to: string;
            distance?: number;
        }>;
    } | null;
    isLoading: boolean;
}

export function RouteDetails({ route, isLoading }: RouteDetailsProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-ios-blue">Detalhes da Rota</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32">
                        <p className="text-ios-gray-500">Gerando rota...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!route) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-ios-blue">Detalhes da Rota</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32">
                        <p className="text-ios-gray-500">Nenhuma rota gerada</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-ios-blue">
                    Rota: {route.origin.icao} → {route.destination.icao}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-ios-gray-500">Distância Total</p>
                        <p className="text-lg font-semibold">
                            {route.distance ? `${route.distance.toFixed(0)} NM` : 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-ios-gray-500">Tempo Estimado</p>
                        <p className="text-lg font-semibold">
                            {route.estimatedTime || 'N/A'}
                        </p>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-ios-gray-700 dark:text-ios-gray-300 mb-2">
                        Sequência de Fixos
                    </h4>
                    <div className="bg-ios-gray-100 dark:bg-ios-gray-800 rounded-ios p-3 overflow-x-auto">
                        <div className="flex flex-col space-y-2">
                            {/* Origem */}
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-ios-green flex items-center justify-center text-white font-bold mr-3">
                                    O
                                </div>
                                <div>
                                    <p className="font-medium">{route.origin.icao}</p>
                                    <p className="text-xs text-ios-gray-500">{route.origin.name || 'Aeroporto de Origem'}</p>
                                </div>
                            </div>

                            {/* Waypoints */}
                            {route.waypoints.map((waypoint, index) => (
                                <div key={index} className="flex items-center ml-4 pl-4 border-l-2 border-ios-gray-300 dark:border-ios-gray-700">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs mr-3 ${getWaypointColor(waypoint.type)}`}>
                                        {getWaypointInitial(waypoint.type)}
                                    </div>
                                    <div>
                                        <p className="font-medium">{waypoint.name}</p>
                                        <p className="text-xs text-ios-gray-500">
                                            {getWaypointTypeName(waypoint.type)}
                                            {waypoint.airway && ` via ${waypoint.airway}`}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Destino */}
                            <div className="flex items-center ml-4 pl-4 border-l-2 border-ios-gray-300 dark:border-ios-gray-700">
                                <div className="w-8 h-8 rounded-full bg-ios-red flex items-center justify-center text-white font-bold mr-3">
                                    D
                                </div>
                                <div>
                                    <p className="font-medium">{route.destination.icao}</p>
                                    <p className="text-xs text-ios-gray-500">{route.destination.name || 'Aeroporto de Destino'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {route.airways.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium text-ios-gray-700 dark:text-ios-gray-300 mb-2">
                            Aerovias Utilizadas
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                            {route.airways.map((airway, index) => (
                                <div
                                    key={index}
                                    className="bg-ios-gray-100 dark:bg-ios-gray-800 rounded-ios p-3 flex justify-between items-center"
                                >
                                    <div>
                                        <p className="font-medium">{airway.name}</p>
                                        <p className="text-xs text-ios-gray-500">{airway.from} → {airway.to}</p>
                                    </div>
                                    {airway.distance && (
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{airway.distance.toFixed(0)} NM</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function getWaypointColor(type: 'fix' | 'navaid' | 'airport'): string {
    switch (type) {
        case 'fix': return 'bg-ios-blue';
        case 'navaid': return 'bg-ios-purple';
        case 'airport': return 'bg-ios-orange';
        default: return 'bg-ios-gray-500';
    }
}

function getWaypointInitial(type: 'fix' | 'navaid' | 'airport'): string {
    switch (type) {
        case 'fix': return 'F';
        case 'navaid': return 'N';
        case 'airport': return 'A';
        default: return '?';
    }
}

function getWaypointTypeName(type: 'fix' | 'navaid' | 'airport'): string {
    switch (type) {
        case 'fix': return 'Fixo';
        case 'navaid': return 'Auxílio à Navegação';
        case 'airport': return 'Aeroporto';
        default: return 'Ponto';
    }
}