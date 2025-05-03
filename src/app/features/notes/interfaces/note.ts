
export interface Note {
    id: string,
    userId: string,
    title: string,
    pinned?: boolean,
    archived?: boolean,
    content:  string,
    img?: string,
    tags?: string[],
    createdAt: Date,
}
