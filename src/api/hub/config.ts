import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

const getBaseHubPath = () => `${import.meta.env.VITE_HUB_URL}/`;

export function createConnection(hub: string): HubConnection {
    return new HubConnectionBuilder()
        .withUrl(`${getBaseHubPath()}${hub}`, { withCredentials: true })
        .withAutomaticReconnect()
        .build();
}
