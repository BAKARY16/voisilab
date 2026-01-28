// Types pour les services, événements et innovations
export interface Service {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Event {
    id: number;
    title: string;
    date: Date;
    location: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Innovation {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}