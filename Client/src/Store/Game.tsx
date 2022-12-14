import { makeAutoObservable, toJS, reaction, runInAction } from "mobx";
import { Piece, Position, gameLog } from "Constants/Types";
import { empty } from "Constants/DefaultSetting";
import { whiteSetUp, blackSetUp } from "Constants/DefaultSetting";
import { Promotion } from "Components";
import {
    isInTable,
    flipPosition,
    getCanMoveTiles,
    getThreatenedTiles,
} from "Utils";

class Game {
    gameResult = "draw";
    isWhite = false;
    isMyTurn = false;
    isEnemyTurn = false;
    inGame = true;
    Store;
    turnLimit = 3000;
    enemyLastTime = 0;
    myLastTime = 0;
    Pieces: Array<Array<Piece>> = [[]];
    focused = { column: -1, row: -1 };
    gameLog: Array<gameLog> = [];

    constructor(Store: any) {
        this.Store = Store;
        makeAutoObservable(this);

        reaction(
            () => this.isMyTurn,
            (isMyTurn) => {
                if (isMyTurn) runInAction(() => (this.myLastTime = 0));
                else {
                    if (this.Store.inGame === false) return;
                    runInAction(() => (this.myLastTime = this.turnLimit));
                    let intervalId = setInterval(() => {
                        this.reduceMyLastTime();
                    }, 10);
                    setTimeout(() => {
                        clearInterval(intervalId);
                    }, this.turnLimit);
                }
            }
        );

        reaction(
            () => this.isEnemyTurn,
            (isEnemyTurn) => {
                if (this.Store.inGame === false) return;
                if (isEnemyTurn) runInAction(() => (this.enemyLastTime = 0));
                else {
                    runInAction(() => (this.enemyLastTime = this.turnLimit));
                    let intervalId = setInterval(() => {
                        this.reduceEnemyLastTime();
                    }, 10);
                    setTimeout(() => {
                        clearInterval(intervalId);
                    }, this.turnLimit);
                }
            }
        );

        reaction(
            () => this.focused,
            () => {
                this.setCanMoveNow();
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
        if (isInTable(row, column)) this.Pieces[row][column].isFocused = true;
    }

    moveTo(from: Position, to: Position, isWhite: boolean, pieceType: string) {
        const isEnPassant =
            pieceType === "pawn" &&
            this.Pieces[to.row][to.column].name === "empty";

        const isCastling =
            pieceType === "king" &&
            from.row === to.row &&
            Math.abs(from.column - to.column) === 2;

        //MoveTo ????????? ???????????? ????????? Move?????? ???????????? Move?????? ???????????? ?????? ???????????????.
        runInAction(() => {
            if (this.isWhite === isWhite) this.isMyTurn = false;
            else this.isEnemyTurn = false;
        });

        //gameLog??? ??? ?????? Move??? ????????????.
        runInAction(() => {
            this.gameLog.push({
                name: this.Pieces[from.row][from.column].name,
                isWhite: this.Pieces[from.row][from.column].isWhite,
                from: from,
                to: to,
            });
        });

        //????????? ????????? ????????? ???????????? focus??? ???????????????.
        //????????? ????????? focus??? ????????? ???????????? focus??? ??????????????? Promotion ???????????? Promotion??? ????????????.
        if (
            this.Pieces[from.row][from.column].isWhite === this.isWhite ||
            (isWhite !== this.isWhite &&
                toJS(this.focused).column === to.column &&
                toJS(this.focused).row === to.row)
        ) {
            runInAction(() => {
                this.setFocused(-1, -1);
                if (this.Store.isModal) this.Store.removeModal();
            });
        }

        //??????????????? king??? ????????? ????????? ????????????.
        if (
            isWhite !== this.isWhite &&
            this.Pieces[to.row][to.column].name === "king" &&
            this.Pieces[to.row][to.column].isWhite === this.isWhite
        ) {
            runInAction(() => (this.gameResult = "lose"));
            this.Store.gameOver(false);
        }

        if (
            isWhite === this.isWhite &&
            this.Pieces[to.row][to.column].name === "king" &&
            this.Pieces[to.row][to.column].isWhite !== this.isWhite
        ) {
            runInAction(() => (this.gameResult = "win"));
            this.Store.gameOver(false);
        }

        //??????????????? ????????? ????????? ????????????.
        runInAction(() => {
            this.setPiece(to.column, to.row, {
                ...this.Pieces[from.row][from.column],
                name: pieceType,
            });
        });

        /* 
            ??????????????? ????????? ????????? ????????????.
            ??????????????? ???????????? ???????????? ???????????? ???????????? ????????????.
        */

        runInAction(() => {
            if (isEnPassant) {
                if (isWhite === this.isWhite)
                    this.setPiece(to.column, to.row + 1, empty());
                else this.setPiece(to.column, to.row - 1, empty());
            } else if (isCastling) {
                if (from.column > to.column) {
                    this.setPiece(to.column + 1, to.row, {
                        ...this.Pieces[to.row][0],
                    });
                    this.setPiece(0, to.row, empty());
                } else {
                    this.setPiece(to.column - 1, to.row, {
                        ...this.Pieces[to.row][7],
                    });
                    this.setPiece(7, to.row, empty());
                }
            }
            this.setPiece(from.column, from.row, empty());
        });
        runInAction(() => {
            this.Pieces = getThreatenedTiles(toJS(this.Pieces), this.isWhite);
        });
    }

    setPiece(column: number, row: number, newPiece: Piece) {
        this.Pieces[row][column].name = newPiece.name;
        this.Pieces[row][column].isWhite = newPiece.isWhite;
        this.Pieces[row][column].isMoved = true;
    }

    setCanMoveNow() {
        if (this.Store.inGame == false) return;
        for (let row = 0; row < 8; row++) {
            for (let column = 0; column < 8; column++)
                this.Pieces[row][column].canMoveNow = false;
        }
        let column = toJS(this.focused).column;
        let row = toJS(this.focused).row;
        if (isInTable(row, column) === false) return;
        let PieceType = this.Pieces[row][column].name;
        if (
            PieceType === "empty" ||
            this.Pieces[row][column].isWhite !== this.isWhite
        )
            return;
        else
            this.Pieces = getCanMoveTiles(
                { column, row },
                toJS(this.Pieces),
                this.isWhite,
                toJS(this.gameLog)
            );
    }

    setTurnLimit(value: number) {
        this.turnLimit = value;
    }

    reduceMyLastTime() {
        if (this.myLastTime == 0) return;
        this.myLastTime -= 10;
    }

    reduceEnemyLastTime() {
        if (this.enemyLastTime == 0) return;
        this.enemyLastTime -= 10;
    }

    setPieces() {
        this.Pieces = this.isWhite ? whiteSetUp : blackSetUp;
    }

    movePiece(column: number, row: number) {
        if (this.Store.socket?.connected) {
            if (this.isMyTurn === false || this.Store.isModal) return;
            const from = {
                column: toJS(this.focused).column,
                row: toJS(this.focused).row,
            };
            const to = { column, row };
            if (
                to.row === 0 &&
                this.Pieces[from.row][from.column].name === "pawn"
            ) {
                this.Store.createModal(
                    <Promotion from={from} to={to}></Promotion>
                );
            } else {
                this.emitPieceMove(
                    from,
                    to,
                    this.Pieces[from.row][from.column].name
                );
            }
        } else console.error("server is not connected");
    }

    emitPieceMove(from: Position, to: Position, pieceType: string) {
        this.Store.socket.emit(
            "pieceMove",
            this.Store.socket.id,
            {
                from,
                to,
                isWhite: this.isWhite,
                pieceType,
            },
            () => {
                this.moveTo(from, to, this.isWhite, pieceType);
            }
        );
        this.Store.socket.emit(
            "waitMyTurn",
            { playerID: this.Store.socket.id, turnLimit: this.turnLimit },
            () => {
                runInAction(() => {
                    this.isMyTurn = true;
                });
            }
        );
    }
    start() {
        runInAction(() => {
            this.isMyTurn = true;
        });
        runInAction(() => {
            this.isEnemyTurn = true;
        });

        this.setPieces();
    }

    returnToLobby() {
        this.turnLimit = 3000;
        this.Pieces = [[]];
        this.focused = { column: -1, row: -1 };
        this.gameLog = [];
    }
}

export default Game;
