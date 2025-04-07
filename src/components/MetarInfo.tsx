'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface MetarData {
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

interface MetarInfoProps {
    data: MetarData | null;
    isLoading: boolean;
    title: string;
}

export function MetarInfo({ data, isLoading, title }: MetarInfoProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-ios-blue">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32">
                        <p className="text-ios-gray-500">Carregando dados METAR...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-ios-blue">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32">
                        <p className="text-ios-gray-500">Dados METAR não disponíveis</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-ios-blue">{title} - {data.icao}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-ios-gray-100 dark:bg-ios-gray-800 p-3 rounded-ios overflow-x-auto">
                    <code className="text-xs font-mono">{data.raw}</code>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {data.temperature !== undefined && (
                        <div>
                            <p className="text-sm text-ios-gray-500">Temperatura</p>
                            <p className="text-lg font-semibold">{data.temperature}°C</p>
                        </div>
                    )}

                    {data.wind && (
                        <div>
                            <p className="text-sm text-ios-gray-500">Vento</p>
                            <p className="text-lg font-semibold">
                                {data.wind.direction}° {data.wind.speed}{data.wind.unit}
                                {data.wind.gust && ` (rajadas ${data.wind.gust}${data.wind.unit})`}
                            </p>
                        </div>
                    )}

                    {data.visibility && (
                        <div>
                            <p className="text-sm text-ios-gray-500">Visibilidade</p>
                            <p className="text-lg font-semibold">
                                {data.visibility.distance} {data.visibility.unit}
                            </p>
                        </div>
                    )}

                    {data.barometer && (
                        <div>
                            <p className="text-sm text-ios-gray-500">Pressão</p>
                            <p className="text-lg font-semibold">{data.barometer.hpa} hPa</p>
                        </div>
                    )}
                </div>

                {data.clouds && data.clouds.length > 0 && (
                    <div>
                        <p className="text-sm text-ios-gray-500 mb-1">Nuvens</p>
                        <div className="flex flex-wrap gap-2">
                            {data.clouds.map((cloud, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-ios-blue/10 text-ios-blue"
                                >
                                    {cloud.cover} a {cloud.altitude}00 ft
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {data.flight_category && (
                    <div className="mt-2">
                        <p className="text-sm text-ios-gray-500">Categoria de Voo</p>
                        <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFlightCategoryColor(data.flight_category)}`}
                        >
                            {data.flight_category}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function getFlightCategoryColor(category: string): string {
    switch (category) {
        case 'VFR':
            return 'bg-ios-green/10 text-ios-green';
        case 'MVFR':
            return 'bg-ios-blue/10 text-ios-blue';
        case 'IFR':
            return 'bg-ios-red/10 text-ios-red';
        case 'LIFR':
            return 'bg-ios-purple/10 text-ios-purple';
        default:
            return 'bg-ios-gray-200 text-ios-gray-700';
    }
}