export interface Car {
    id: string,
    model: CarModel,
    services: CarService[],
    serviceDue: CarServiceDue[],
}

export interface CarModel {
    id: string,
    name: string
}

export interface CarService {
    date: Date,
    description: string,
    id: string,
    serviceType: CarServiceType,
}

export interface CarServiceDue {
    dueBefore: string,
    dueBeforeApprox: string,
    dueAt?: number,
    dueIn?: number,
    serviceType: CarServiceType,
}

export interface CarServiceInterval {
    days?: number,
    range?: number,
    serviceType: CarServiceType
}

export interface CarServiceType {
    id: string,
    name: string
}

export interface CarLogFilters {
    hasOdometer?: boolean,
}