export interface Goal {
    id: string;
    userId: string;
    goalCategoryId: string;
    title: string;
    description: string;
    dueDate: Date;
    order: number;
    priority: 'baja' | 'media' | 'alta';
    state: 'nueva' | 'en proceso' | 'completada' | 'cancelada';
    progress: number;
    objective: number;
    unit: string
    img: string;
    createdAt: Date;
    updatedAt: Date;
}
