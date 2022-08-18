export const isInTable = (row: number, column: number) =>
    column > -1 && row > -1 && column < 8 && row < 8;
