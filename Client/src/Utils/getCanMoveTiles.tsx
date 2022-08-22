import {
    knightMove,
    kingMove,
    queenMove,
    rookMove,
    bishopMove,
} from "Constants/pieceMove";
import { isInTable } from "Utils/isInTable";
import { gameLog, Piece, Position } from "Constants/Types";

const isEnPassant = (
    column: number,
    row: number,
    Piece: Piece,
    lastGameLog: gameLog
) => {
    let checkLastMoveIsPawn =
        lastGameLog.name === "pawn" &&
        lastGameLog.to.column === column &&
        lastGameLog.to.row === row &&
        lastGameLog.from.column === column &&
        lastGameLog.from.row === row - 2;
    return Piece.name === "pawn" && checkLastMoveIsPawn;
};

export const getCanMoveTiles = (
    focused: Position,
    Pieces: Array<Array<Piece>>,
    isWhite: boolean,
    gameLog: Array<gameLog>
) => {
    let column = focused.column;
    let row = focused.row;
    let PieceType = Pieces[row][column].name;
    if (PieceType === "pawn") {
        if (
            isInTable(row - 1, column) &&
            Pieces[row - 1][column].name === "empty"
        ) {
            Pieces[row - 1][column].canMoveNow = true;
            if (
                Pieces[row][column].isMoved === false &&
                isInTable(row - 2, column) &&
                Pieces[row - 2][column].name === "empty"
            )
                Pieces[row - 2][column].canMoveNow = true;
        }
        if (
            isInTable(row - 1, column - 1) &&
            Pieces[row - 1][column - 1].name !== "empty" &&
            Pieces[row - 1][column - 1].isWhite !== isWhite
        )
            Pieces[row - 1][column - 1].canMoveNow = true;
        if (
            isInTable(row - 1, column + 1) &&
            Pieces[row - 1][column + 1].name !== "empty" &&
            Pieces[row - 1][column + 1].isWhite !== isWhite
        )
            Pieces[row - 1][column + 1].canMoveNow = true;

        if (
            isInTable(row, column - 1) &&
            gameLog.length > 0 &&
            isEnPassant(
                column - 1,
                row,
                Pieces[row][column - 1],
                gameLog[gameLog.length - 1]
            )
        )
            Pieces[row - 1][column - 1].canMoveNow = true;

        if (
            isInTable(row, column + 1) &&
            gameLog.length > 0 &&
            isEnPassant(
                column + 1,
                row,
                Pieces[row][column + 1],
                gameLog[gameLog.length - 1]
            )
        )
            Pieces[row - 1][column + 1].canMoveNow = true;
    } else if (PieceType === "knight") {
        knightMove.forEach(({ x, y }) => {
            if (
                isInTable(row + y, column + x) === false ||
                (Pieces[row + y][column + x].name !== "empty" &&
                    Pieces[row + y][column + x].isWhite === isWhite)
            )
                return;
            Pieces[row + y][column + x].canMoveNow = true;
        });
    } else if (PieceType === "king") {
        kingMove.forEach(({ x, y }) => {
            if (
                isInTable(row + y, column + x) === false ||
                (Pieces[row + y][column + x].name !== "empty" &&
                    Pieces[row + y][column + x].isWhite === isWhite)
            )
                return;
            Pieces[row + y][column + x].canMoveNow = true;
        });
    } else if (
        PieceType === "queen" ||
        PieceType === "rook" ||
        PieceType === "bishop"
    ) {
        let pieceMove = {
            queen: queenMove,
            rook: rookMove,
            bishop: bishopMove,
        }[PieceType];
        for (let dir = 0; dir < pieceMove.dir; dir++) {
            let nextColumn = column + pieceMove.dx[dir];
            let nextRow = row + pieceMove.dy[dir];
            while (isInTable(nextRow, nextColumn)) {
                if (Pieces[nextRow][nextColumn].name !== "empty") {
                    if (Pieces[nextRow][nextColumn].isWhite !== isWhite)
                        Pieces[nextRow][nextColumn].canMoveNow = true;
                    break;
                } else {
                    Pieces[nextRow][nextColumn].canMoveNow = true;
                    nextColumn = nextColumn + pieceMove.dx[dir];
                    nextRow = nextRow + pieceMove.dy[dir];
                }
            }
        }
    }
    return Pieces;
};
