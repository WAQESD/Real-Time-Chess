import { makeAutoObservable, toJS, reaction, runInAction } from "mobx";
import { Piece, whiteSetUp, blackSetUp } from "Constants/defaultSetting";
import { knightMove, kingMove } from "Constants/pieceMove";
import { io } from "socket.io-client";

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

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.focused,
            (focused) => {
                for (let row = 0; row < 8; row++) {
                    for (let column = 0; column < 8; column++)
                        this.Pieces[row][column].canMoveNow = false;
                }
                let column = toJS(focused).column;
                let row = toJS(focused).row;
                let PieceType = this.Pieces[row][column].name;
                if (
                    PieceType === "empty" ||
                    this.Pieces[row][column].isWhite !== this.isWhite
                )
                    return;
                else if (PieceType === "pawn") {
                    this.Pieces[row - 1][column].canMoveNow = true;
                    if (this.Pieces[row - 1][column].isMoved === false)
                        this.Pieces[row - 2][column].canMoveNow = true;
                } else if (PieceType === "knight") {
                    knightMove.forEach(({ x, y }) => {
                        if (
                            row + y < 0 ||
                            row + y >= 8 ||
                            column + x < 0 ||
                            column + x >= 8 ||
                            this.Pieces[row + y][column + x].isWhite ===
                                this.isWhite
                        )
                            return;
                        this.Pieces[row + y][column + x].canMoveNow = true;
                    });
                } else if (PieceType === "king") {
                    kingMove.forEach(({ x, y }) => {
                        if (
                            row + y < 0 ||
                            row + y >= 8 ||
                            column + x < 0 ||
                            column + x >= 8 ||
                            this.Pieces[row + y][column + x].isWhite ===
                                this.isWhite
                        )
                            return;
                        this.Pieces[row + y][column + x].canMoveNow = true;
                    });
                }
            }
        );
    }

    setFocused(column: number, row: number) {
        if (toJS(this.focused).row > -1 && toJS(this.focused).column > -1) {
            this.Pieces[toJS(this.focused).row][
                toJS(this.focused).column
            ].isFocused = false;
        }

        this.focused = { column, row };
        this.Pieces[row][column].isFocused = true;
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
