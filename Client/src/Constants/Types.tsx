export interface gameLog {
    name: string;
    isWhite: boolean;
    from: Position;
    to: Position;
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
    isThreatened: boolean;
    canMoveNow: boolean;
}
