import { makeAutoObservable, toJS, reaction, runInAction } from "mobx";
import { Piece, whiteSetUp, blackSetUp } from "Constants/defaultSetting";
import { io } from "socket.io-client";
import { isInTable } from "Utils/isInTable";
import { empty } from "Constants/defaultSetting";
import { Position, flipPosition } from "Utils/flipPosition";
import { gameLog } from "Constants/gameLogType";
import {
    knightMove,
    kingMove,
    queenMove,
    rookMove,
    bishopMove,
} from "Constants/pieceMove";

const ENDPOINT = "//localhost:3001/";

class Store {
    socket = io();
    roomId = "";
    inGame = false;
    isMatched = false;
    isHost = false;
    isWhite = false;
    Pieces: Array<Array<Piece>> = [[]];
    tableSize = Math.min(window.innerWidth, window.innerHeight);
    focused = { column: -1, row: -1 };
    gameLog: Array<gameLog> = [];

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.inGame,
            (inGame) => {
                if (inGame == false) return;
                this.socket.on("pieceMove", ({ from, to }) => {
                    this.moveTo(flipPosition(from), flipPosition(to));
                });
            }
        );

        reaction(
            () => this.focused,
            (focused) => {
                for (let row = 0; row < 8; row++) {
                    for (let column = 0; column < 8; column++)
                        this.Pieces[row][column].canMoveNow = false;
                }
                let column = toJS(focused).column;
                let row = toJS(focused).row;
                if (isInTable(row, column) === false) return;
                let PieceType = this.Pieces[row][column].name;
                if (
                    PieceType === "empty" ||
                    this.Pieces[row][column].isWhite !== this.isWhite
                )
                    return;
                else if (PieceType === "pawn") {
                    if (
                        isInTable(row - 1, column) &&
                        this.Pieces[row - 1][column].name === "empty"
                    ) {
                        this.Pieces[row - 1][column].canMoveNow = true;
                        if (
                            this.Pieces[row][column].isMoved === false &&
                            isInTable(row - 2, column) &&
                            this.Pieces[row - 2][column].name === "empty"
                        )
                            this.Pieces[row - 2][column].canMoveNow = true;
                    }
                    if (
                        isInTable(row - 1, column - 1) &&
                        this.Pieces[row - 1][column - 1].name !== "empty"
                    )
                        this.Pieces[row - 1][column - 1].canMoveNow = true;
                    if (
                        isInTable(row - 1, column + 1) &&
                        this.Pieces[row - 1][column + 1].name !== "empty"
                    )
                        this.Pieces[row - 1][column + 1].canMoveNow = true;
                } else if (PieceType === "knight") {
                    knightMove.forEach(({ x, y }) => {
                        if (
                            isInTable(row + y, column + x) === false ||
                            (this.Pieces[row + y][column + x].name !==
                                "empty" &&
                                this.Pieces[row + y][column + x].isWhite ===
                                    this.isWhite)
                        )
                            return;
                        this.Pieces[row + y][column + x].canMoveNow = true;
                    });
                } else if (PieceType === "king") {
                    kingMove.forEach(({ x, y }) => {
                        if (
                            isInTable(row + y, column + x) === false ||
                            (this.Pieces[row + y][column + x].name !==
                                "empty" &&
                                this.Pieces[row + y][column + x].isWhite ===
                                    this.isWhite)
                        )
                            return;
                        this.Pieces[row + y][column + x].canMoveNow = true;
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
                            if (
                                this.Pieces[nextRow][nextColumn].name !==
                                "empty"
                            ) {
                                if (
                                    this.Pieces[nextRow][nextColumn].isWhite !==
                                    this.isWhite
                                )
                                    this.Pieces[nextRow][
                                        nextColumn
                                    ].canMoveNow = true;
                                break;
                            } else {
                                this.Pieces[nextRow][nextColumn].canMoveNow =
                                    true;
                                nextColumn = nextColumn + pieceMove.dx[dir];
                                nextRow = nextRow + pieceMove.dy[dir];
                            }
                        }
                    }
                }
            }
        );
    }
    moveTo(from: Position, to: Position) {
        runInAction(() => {
            this.gameLog.push({
                name: this.Pieces[from.row][from.column].name,
                isWhite: this.Pieces[from.row][from.column].isWhite,
                from: from,
                to: to,
            });
            console.log(toJS(this.gameLog));
        });
        runInAction(() => {
            this.setPiece(
                to.column,
                to.row,
                this.Pieces[from.row][from.column]
            );
        });
        runInAction(() => {
            this.setPiece(from.column, from.row, empty());
        });
        runInAction(() => {
            this.setFocused(-1, -1);
        });
    }
    setPiece(column: number, row: number, newPiece: Piece) {
        this.Pieces[row][column].name = newPiece.name;
        this.Pieces[row][column].isWhite = newPiece.isWhite;
        this.Pieces[row][column].isMoved = true;
    }

    setFocused(column: number, row: number) {
        if (toJS(this.focused).row > -1 && toJS(this.focused).column > -1) {
            this.Pieces[toJS(this.focused).row][
                toJS(this.focused).column
            ].isFocused = false;
        }

        this.focused = { column, row };
        if (isInTable(row, column)) this.Pieces[row][column].isFocused = true;
    }

    setPieces() {
        this.Pieces = this.isWhite ? whiteSetUp : blackSetUp;
    }

    setInGame(bool: boolean) {
        this.inGame = bool;
    }

    setIsHost(bool: boolean) {
        this.isHost = bool;
    }

    connectSocket(): void {
        if (this.socket?.connected) return;
        this.socket = io(ENDPOINT, { transports: ["websocket"] });
    }

    disconnectSocket(): void {
        if (this.socket?.connected) this.socket.disconnect();
    }
}

export default Store;
