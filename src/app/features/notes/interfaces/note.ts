import { Checklist } from "./checklist";

export interface Note {
    id: string,
    userId: string,
    title: string,
    type: 'text' | 'checklist',
    pinned?: boolean,
    archived?: boolean,
    color?: string,
    content:  Checklist[],
    img?: string,
    createdAt: Date,
}
