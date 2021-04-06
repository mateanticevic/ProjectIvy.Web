export interface Airport {
    id: string,
    name: string,
}

export interface Flight {
    id: string,
    name: string,
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