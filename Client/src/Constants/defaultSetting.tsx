export interface Piece {
    name: string;
    isMoved: boolean;
    isWhite: boolean;
    isFocused: boolean;
    canMoveNow: boolean;
}

const common = {
    isMoved: false,
    isFocused: false,
    canMoveNow: false,
};

const pawn: (isWhite: boolean) => Piece = (isWhite) => {
    return {
        name: "pawn",
        isWhite: isWhite,
        ...common,
    };
};

const rook: (isWhite: boolean) => Piece = (isWhite) => {
    return {
        name: "rook",
        isWhite: isWhite,
        ...common,
    };
};

const bishop: (isWhite: boolean) => Piece = (isWhite) => {
    return {
        name: "bishop",
        isWhite: isWhite,
        ...common,
    };
};

const knight: (isWhite: boolean) => Piece = (isWhite) => {
    return {
        name: "knight",
        isWhite: isWhite,
        ...common,
    };
};

const queen: (isWhite: boolean) => Piece = (isWhite) => {
    return {
        name: "queen",
        isWhite: isWhite,
        ...common,
    };
};

const king: (isWhite: boolean) => Piece = (isWhite) => {
    return {
        name: "king",
        isWhite: isWhite,
        ...common,
    };
};

export const empty: () => Piece = () => {
    return {
        name: "empty",
        isWhite: false,
        ...common,
    };
};

export const whiteSetUp: Array<Array<Piece>> = [
    [
        rook(false),
        knight(false),
        bishop(false),
        queen(false),
        king(false),
        bishop(false),
        knight(false),
        rook(false),
    ],
    [
        pawn(false),
        pawn(false),
        pawn(false),
        pawn(false),
        pawn(false),
        pawn(false),
        pawn(false),
        pawn(false),
    ],
    [empty(), empty(), empty(), empty(), empty(), empty(), empty(), empty()],
    [empty(), empty(), empty(), empty(), empty(), empty(), empty(), empty()],
    [empty(), empty(), empty(), empty(), empty(), empty(), empty(), empty()],
    [empty(), empty(), empty(), empty(), empty(), empty(), empty(), empty()],
    [
        pawn(true),
        pawn(true),
        pawn(true),
        pawn(true),
        pawn(true),
        pawn(true),
        pawn(true),
        pawn(true),
    ],
    [
        rook(true),
        knight(true),
        bishop(true),
        queen(true),
        king(true),
        bishop(true),
        knight(true),
        rook(true),
    ],
];

export const blackSetUp: Array<Array<Piece>> = [
    [
        rook(true),
        knight(true),
        bishop(true),
        king(true),
        queen(true),
        bishop(true),
        knight(true),
        rook(true),
    ],
    [
        pawn(true),
        pawn(true),
        pawn(true),
        pawn(true),
        pawn(true),
        pawn(true),
        pawn(true),
        pawn(true),
    ],
    [empty(), empty(), empty(), empty(), empty(), empty(), empty(), empty()],
    [empty(), empty(), empty(), empty(), empty(), empty(), empty(), empty()],
    [empty(), empty(), empty(), empty(), empty(), empty(), empty(), empty()],
    [empty(), empty(), empty(), empty(), empty(), empty(), empty(), empty()],
    [
        pawn(false),
        pawn(false),
        pawn(false),
        pawn(false),
        pawn(false),
        pawn(false),
        pawn(false),
        pawn(false),
    ],
    [
        rook(false),
        knight(false),
        bishop(false),
        king(false),
        queen(false),
        bishop(false),
        knight(false),
        rook(false),
    ],
];
