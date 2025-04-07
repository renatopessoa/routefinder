'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { AirportAutocomplete } from '@/components/AirportAutocomplete';

interface RouteFormProps {
    onSubmit: (origin: string, destination: string) => void;
    isLoading: boolean;
}

export function RouteForm({ onSubmit, isLoading }: RouteFormProps) {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!origin || !destination) return;
        onSubmit(origin, destination);
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-center text-ios-blue">✈️ Gerador de Rotas Aéreas</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <AirportAutocomplete
                            id="origin"
                            label="Aeroporto de Origem (ICAO)"
                            placeholder="Ex: SBGR"
                            value={origin}
                            onChange={setOrigin}
                        />
                    </div>
                    <div className="space-y-2">
                        <AirportAutocomplete
                            id="destination"
                            label="Aeroporto de Destino (ICAO)"
                            placeholder="Ex: SBRJ"
                            value={destination}
                            onChange={setDestination}
                        />
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <Button
                    onClick={handleSubmit}
                    className="w-full"
                    disabled={!origin || !destination || isLoading}
                    variant="ios"
                >
                    {isLoading ? 'Gerando rota...' : 'Gerar Rota'}
                </Button>
            </CardFooter>
        </Card>
    );
}