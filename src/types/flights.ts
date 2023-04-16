export interface Airport {
    id: string,
    name: string,
    iata: string,
}

export interface Airline {
    id: string,
    name: string,
}

export interface Flight {
    id: string;
    airline: Airline;
    destination: Airport;
    origin: Airport;
    name: string;
    departure: Date;
    arrival: Date;
}

export interface FlightBinding {
    id: string,
    name: string,
    departure: string,
    arrival: string,
    flightNumber: string,
    originId: string,
    destinationId: string,
    airlineId: string,
}