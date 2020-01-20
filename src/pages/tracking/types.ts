export interface Movement {
    id: string;
    day: string;
    distance: number;
    trackings: any[];
    color: string;
    onRemoveTracking: (id: string) => void;
}
