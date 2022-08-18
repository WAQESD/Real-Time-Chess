export const knightMove = [
    { x: 2, y: 1 },
    { x: 2, y: -1 },
    { x: -2, y: 1 },
    { x: -2, y: -1 },
    { x: 1, y: 2 },
    { x: 1, y: -2 },
    { x: -1, y: 2 },
    { x: -1, y: -2 },
];

export const kingMove = [
    { x: 1, y: 1 },
    { x: 1, y: 0 },
    { x: 1, y: -1 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: -1, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
];

export const queenMove = {
    dir: 8,
    dx: [-1, -1, -1, 0, 0, 1, 1, 1],
    dy: [-1, 1, 0, -1, 1, -1, 1, 0],
};

export const rookMove = {
    dir: 4,
    dx: [-1, 1, 0, 0],
    dy: [0, 0, 1, -1],
};

export const bishopMove = {
    dir: 4,
    dx: [-1, 1, -1, 1],
    dy: [-1, 1, 1, -1],
};
