import {
    knightMove,
    kingMove,
    queenMove,
    rookMove,
    bishopMove,
} from "Constants/PieceMove";
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

const canRightCastling = (Pieces: Array<Array<Piece>>, column: number) => {
    const neverMovedKing =
        Pieces[7][column].name === "king" &&
        Pieces[7][column].isMoved === false;
    const neverMovedRook =
        Pieces[7][7].name === "rook" && Pieces[7][7].isMoved === false;
    let isEmptyBetween = true;
    for (let c = column + 1; c < 7; c++)
        isEmptyBetween &&= Pieces[7][c].name === "empty";
    let isNotThreatenedBetween = true;
    for (let c = column; c < 7; c++)
        isNotThreatenedBetween &&= Pieces[7][c].isThreatened === false;
    return (
        neverMovedKing &&
        neverMovedRook &&
        isEmptyBetween &&
        isNotThreatenedBetween
    );
};

const canLeftCastling = (Pieces: Array<Array<Piece>>, column: number) => {
    const neverMovedKing =
        Pieces[7][column].name === "king" &&
        Pieces[7][column].isMoved === false;
    const neverMovedRook =
        Pieces[7][0].name === "rook" && Pieces[7][0].isMoved === false;
    let isEmptyBetween = true;
    for (let c = column - 1; c > 0; c--)
        isEmptyBetween &&= Pieces[7][c].name === "empty";
    let isNotThreatenedBetween = true;
    for (let c = column; c > 1; c--)
        isNotThreatenedBetween &&= Pieces[7][c].isThreatened === false;
    return (
        neverMovedKing &&
        neverMovedRook &&
        isEmptyBetween &&
        isNotThreatenedBetween
    );
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
        if (canRightCastling(Pieces, column))
            Pieces[row][column + 2].canMoveNow = true;
        if (canLeftCastling(Pieces, column))
            Pieces[row][column - 2].canMoveNow = true;
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
