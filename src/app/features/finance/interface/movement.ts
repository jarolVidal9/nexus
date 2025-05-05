export interface Movement {
    id: string;
    title: string;
    date: Date;
    amount: number;
    type: 'ingreso' | 'egreso';
}
