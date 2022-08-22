export interface gameLog {
    name: string;
    isWhite: boolean;
    from: { column: number; row: number };
    to: { column: number; row: number };
}

export interface Position {
    column: number;
    row: number;
}

export interface Piece {
    name: string;
    isMoved: boolean;
    isWhite: boolean;
    isFocused: boolean;
    canMoveNow: boolean;
}
