const cdnUrl = import.meta.env.VITE_CDN_URL;

export const beerUrl = (id: string) => `${cdnUrl}/beers/${id}.png`;

export const carUrl = (id: string) => `${cdnUrl}/cars/${id}.jpg`;

export const iconUrl = (id: string) => `${cdnUrl}/icons/${id}.png`;

export const vendorUrl = (id: string) => `${cdnUrl}/vendors/${id}.jpg`;