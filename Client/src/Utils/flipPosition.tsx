export interface Position {
    column: number;
    row: number;
}

export const flipPosition = (position: Position) => {
    return { column: 7 - position.column, row: 7 - position.row };
};
