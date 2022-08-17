export interface Piece {
    name: string;
    isMoved: boolean;
    isWhite: boolean;
}

const pawn: (isWhite: boolean) => Piece = (isWhite) => {
    return {
        name: "pawn",
        isMoved: false,
        isWhite: isWhite,
    };
};

const rook: (isWhite: boolean) => Piece = (isWhite) => {
    return {
        name: "rook",
        isMoved: false,
        isWhite: isWhite,
    };
};

const bishop: (isWhite: boolean) => Piece = (isWhite) => {
    return {
        name: "bishop",
        isMoved: false,
        isWhite: isWhite,
    };
};

const knight: (isWhite: boolean) => Piece = (isWhite) => {
    return {
        name: "knight",
        isMoved: false,
        isWhite: isWhite,
    };
};

const queen: (isWhite: boolean) => Piece = (isWhite) => {
    return {
        name: "queen",
        isMoved: false,
        isWhite: isWhite,
    };
};

const king: (isWhite: boolean) => Piece = (isWhite) => {
    return {
        name: "king",
        isMoved: false,
        isWhite: isWhite,
    };
};

const empty: () => Piece = () => {
    return {
        name: "empty",
        isMoved: false,
        isWhite: false,
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

/*
const whiteSetUp: Array<Piece> = [
    {
        name: "pawn",
        isMoved: false,
        isWhite: true,
        column: 1,
        row: 7,
    },
    {
        name: "pawn",
        isMoved: false,
        isWhite: true,
        column: 2,
        row: 7,
    },
    {
        name: "pawn",
        isMoved: false,
        isWhite: true,
        column: 3,
        row: 7,
    },
    {
        name: "pawn",
        isMoved: false,
        isWhite: true,
        column: 4,
        row: 7,
    },
    {
        name: "pawn",
        isMoved: false,
        isWhite: true,
        column: 5,
        row: 7,
    },
    {
        name: "pawn",
        isMoved: false,
        isWhite: true,
        column: 6,
        row: 7,
    },
    {
        name: "pawn",
        isMoved: false,
        isWhite: true,
        column: 7,
        row: 7,
    },
    {
        name: "pawn",
        isMoved: false,
        isWhite: true,
        column: 8,
        row: 7,
    },
    {
        name: "rook",
        isMoved: false,
        isWhite: true,
        column: 1,
        row: 8,
    },
    {
        name: "rook",
        isMoved: false,
        isWhite: true,
        column: 8,
        row: 8,
    },
    {
        name: "knight",
        isMoved: false,
        isWhite: true,
        column: 2,
        row: 8,
    },
    {
        name: "knight",
        isMoved: false,
        isWhite: true,
        column: 7,
        row: 8,
    },
    {
        name: "bishop",
        isMoved: false,
        isWhite: true,
        column: 2,
        row: 8,
    },
    {
        name: "bishop",
        isMoved: false,
        isWhite: true,
        column: 2,
        row: 8,
    },
    {
        name: "queen",
        isMoved: false,
        isWhite: true,
        column: 4,
        row: 8,
    },
    {
        name: "king",
        isMoved: false,
        isWhite: true,
        column: 5,
        row: 8,
    },
];

export { whiteSetUp };
*/
