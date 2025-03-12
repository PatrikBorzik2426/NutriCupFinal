export interface User {
    id: number;
    login: string;
    admin: boolean;
    verified: boolean;
    caloriesGoal: number;
    waterGoal: number;
}