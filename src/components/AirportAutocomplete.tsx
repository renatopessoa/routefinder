'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/Input';
import { Airport } from '@/types';
import { searchAirports } from '@/services/api';

interface AirportAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    label: string;
    placeholder?: string;
    id: string;
}

export function AirportAutocomplete({
    value,
    onChange,
    label,
    placeholder,
    id,
}: AirportAutocompleteProps) {
    const [query, setQuery] = useState(value);
    const [results, setResults] = useState<Airport[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const airports = await searchAirports(query);
                setResults(airports);
            } catch (error) {
                console.error('Erro ao buscar aeroportos:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchResults, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.toUpperCase();
        setQuery(newValue);
        setShowResults(true);
    };

    const handleSelectAirport = (airport: Airport) => {
        setQuery(airport.icao);
        onChange(airport.icao);
        setShowResults(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <label htmlFor={id} className="text-sm font-medium text-ios-gray-700 dark:text-ios-gray-300 mb-1 block">
                {label}
            </label>
            <Input
                id={id}
                value={query}
                onChange={handleInputChange}
                placeholder={placeholder || 'Digite o código ICAO'}
                maxLength={4}
                className="uppercase"
                onFocus={() => setShowResults(true)}
            />

            {showResults && results.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-ios-gray-900 rounded-ios border border-ios-gray-200 dark:border-ios-gray-700 shadow-ios max-h-60 overflow-auto">
                    {results.map((airport) => (
                        <button
                            key={airport.icao}
                            className="w-full text-left px-4 py-2 hover:bg-ios-gray-100 dark:hover:bg-ios-gray-800 transition-colors"
                            onClick={() => handleSelectAirport(airport)}
                        >
                            <div className="font-medium">{airport.icao}</div>
                            <div className="text-xs text-ios-gray-500">{airport.name}</div>
                            <div className="text-xs text-ios-gray-400">{airport.city}, {airport.country}</div>
                        </button>
                    ))}
                </div>
            )}

            {isLoading && (
                <div className="absolute right-3 top-9">
                    <div className="w-4 h-4 border-2 border-ios-blue border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}