import {
    knightMove,
    kingMove,
    queenMove,
    rookMove,
    bishopMove,
} from "Constants/PieceMove";
import { isInTable } from "Utils/isInTable";
import { Piece } from "Constants/Types";

export const getThreatenedTiles = (
    Pieces: Array<Array<Piece>>,
    isWhite: boolean
) => {
    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
            Pieces[row][column].isThreatened = false;
        }
    }

    Pieces.forEach((line, row) => {
        line.forEach((Piece, column) => {
            if (Piece.name === "empty") return;
            if (Piece.isWhite === isWhite) return;
            if (Piece.name === "pawn") {
                if (isInTable(row + 1, column + 1))
                    Pieces[row + 1][column + 1].isThreatened = true;
                if (isInTable(row + 1, column - 1))
                    Pieces[row + 1][column - 1].isThreatened = true;
            } else if (Piece.name === "knight") {
                knightMove.forEach(({ x, y }) => {
                    if (isInTable(row + y, column + x) === false) return;
                    Pieces[row + y][column + x].isThreatened = true;
                });
            } else if (Piece.name === "king") {
                kingMove.forEach(({ x, y }) => {
                    if (isInTable(row + y, column + x) === false) return;
                    Pieces[row + y][column + x].isThreatened = true;
                });
            } else if (
                Piece.name === "queen" ||
                Piece.name === "rook" ||
                Piece.name === "bishop"
            ) {
                let pieceMove = {
                    queen: queenMove,
                    rook: rookMove,
                    bishop: bishopMove,
                }[Piece.name];
                for (let dir = 0; dir < pieceMove.dir; dir++) {
                    let nextColumn = column + pieceMove.dx[dir];
                    let nextRow = row + pieceMove.dy[dir];
                    while (isInTable(nextRow, nextColumn)) {
                        if (Pieces[nextRow][nextColumn].name !== "empty") {
                            Pieces[nextRow][nextColumn].isThreatened = true;
                            break;
                        } else {
                            Pieces[nextRow][nextColumn].isThreatened = true;
                            nextColumn = nextColumn + pieceMove.dx[dir];
                            nextRow = nextRow + pieceMove.dy[dir];
                        }
                    }
                }
            }
        });
    });
    return Pieces;
};
