import { Goal } from "./goal";

export interface Category {
    id:string;
    name:string;
    order:number;
    Goals: Goal[]
}
