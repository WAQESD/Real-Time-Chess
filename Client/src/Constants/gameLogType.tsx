export interface gameLog {
    name: string;
    isWhite: boolean;
    from: { column: number; row: number };
    to: { column: number; row: number };
}
