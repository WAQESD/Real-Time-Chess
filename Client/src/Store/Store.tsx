import { makeAutoObservable, toJS, reaction, runInAction } from "mobx";
import { io } from "socket.io-client";
import {
    isInTable,
    flipPosition,
    getCanMoveTiles,
    getThreatenedTiles,
} from "Utils";
import { empty } from "Constants/DefaultSetting";
import { Position, gameLog } from "Constants/Types";
import { style } from "Constants/Style";
import { Piece, whiteSetUp, blackSetUp } from "Constants/DefaultSetting";
import { CountDown, GameOver, Promotion, Ready } from "Components";

const ENDPOINT = "//localhost:3001/";

class Store {
    socket = io();
    roomId = "";
    inGame = false;
    isMatched = false;
    isHost = false;
    isWhite = false;
    isModal = false;
    isMyTurn = false;
    isEnemyTurn = false;
    isReady = false;
    enemyReady = false;
    turnLimit = 3000;
    countDown = 3;
    enemyID = "";
    gameResult = "draw";
    enemyLastTime = 0;
    myLastTime = 0;
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    modalContents = (<></>);
    Pieces: Array<Array<Piece>> = [[]];
    focused = { column: -1, row: -1 };
    gameLog: Array<gameLog> = [];

    get infoSize() {
        let infoSize =
            (Math.max(this.windowWidth, this.windowHeight) -
                Math.min(this.windowWidth, this.windowHeight)) /
            2;
        if (infoSize > style.minInfoSize) return infoSize;
        else return style.minInfoSize;
    }

    get tableSize() {
        let tableSize =
            Math.max(this.windowWidth, this.windowHeight) - 2 * this.infoSize;
        if (tableSize > style.minTableSize) return tableSize;
        else return style.minTableSize;
    }

    get bothReady() {
        return this.isReady && this.enemyReady;
    }

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.bothReady,
            (bothReady) => {
                if (bothReady) {
                    setTimeout(() => {
                        this.setCountDown(3);
                    }, 1000);
                }
            }
        );

        reaction(
            () => this.isMyTurn,
            (isMyTurn) => {
                if (isMyTurn) runInAction(() => (this.myLastTime = 0));
                else {
                    if (this.inGame === false) return;
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
                if (this.inGame === false) return;
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
            () => this.inGame,
            (inGame) => {
                if (inGame) {
                    runInAction(() => {
                        this.isMyTurn = true;
                    });
                    runInAction(() => {
                        this.isEnemyTurn = true;
                    });
                    this.setPieces();
                    this.socket.on(
                        "pieceMove",
                        ({ from, to, isWhite, pieceType }) => {
                            this.moveTo(
                                flipPosition(from),
                                flipPosition(to),
                                isWhite,
                                pieceType
                            );
                            this.setCanMoveNow();
                        }
                    );
                    this.socket.on("waitEnemyTurn", () => {
                        runInAction(() => (this.isEnemyTurn = true));
                    });
                    this.socket.on("enemyReady", () => {
                        this.setEnemyReady(true);
                    });
                    this.socket.on("enemyCancelReady", () => {
                        this.setEnemyReady(false);
                    });
                    this.socket.on("enemyExit", () => {
                        this.gameOver(true);
                        this.socket.emit("enemyExit");
                    });
                } else {
                    this.socket.off();
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

    setCanMoveNow() {
        if (this.inGame == false) return;
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

    gameOver(enemyExit: boolean) {
        if (enemyExit) {
            this.createModal(
                <GameOver
                    gameResult="win"
                    enemyExit={enemyExit}
                    onClick={() => {
                        this.removeModal();
                        this.returnToLobby();
                    }}
                ></GameOver>
            );
        } else {
            this.createModal(
                <GameOver
                    gameResult={this.gameResult}
                    enemyExit={enemyExit}
                    onClick={() => {
                        this.removeModal();
                        this.returnToLobby();
                    }}
                ></GameOver>
            );
        }
    }

    returnToLobby() {
        this.inGame = false;
        this.isMatched = false;
        this.isHost = false;
        this.isReady = false;
        this.enemyReady = false;
        this.turnLimit = 3000;
        this.enemyID = "";
        this.Pieces = [[]];
        this.focused = { column: -1, row: -1 };
        this.gameLog = [];
    }

    reduceMyLastTime() {
        if (this.myLastTime == 0) return;
        this.myLastTime -= 10;
    }

    reduceEnemyLastTime() {
        if (this.enemyLastTime == 0) return;
        this.enemyLastTime -= 10;
    }

    resizeAction() {
        runInAction(() => {
            this.windowWidth = window.innerWidth;
        });
        runInAction(() => {
            this.windowHeight = window.innerHeight;
        });
    }

    moveTo(from: Position, to: Position, isWhite: boolean, pieceType: string) {
        const isEnPassant =
            pieceType === "pawn" &&
            this.Pieces[to.row][to.column].name === "empty";

        const isCastling =
            pieceType === "king" &&
            from.row === to.row &&
            Math.abs(from.column - to.column) === 2;

        runInAction(() => {
            if (this.isWhite === isWhite) this.isMyTurn = false;
            else this.isEnemyTurn = false;
        });
        runInAction(() => {
            this.gameLog.push({
                name: this.Pieces[from.row][from.column].name,
                isWhite: this.Pieces[from.row][from.column].isWhite,
                from: from,
                to: to,
            });
        });
        if (
            this.Pieces[from.row][from.column].isWhite === this.isWhite ||
            (isWhite !== this.isWhite &&
                toJS(this.focused).column === to.column &&
                toJS(this.focused).row === to.row)
        ) {
            runInAction(() => {
                this.setFocused(-1, -1);
                if (this.isModal) this.removeModal();
            });
        }
        if (
            isWhite !== this.isWhite &&
            this.Pieces[to.row][to.column].name === "king" &&
            this.Pieces[to.row][to.column].isWhite === this.isWhite
        ) {
            runInAction(() => (this.gameResult = "lose"));
            this.gameOver(false);
        }
        if (
            isWhite === this.isWhite &&
            this.Pieces[to.row][to.column].name === "king" &&
            this.Pieces[to.row][to.column].isWhite !== this.isWhite
        ) {
            runInAction(() => (this.gameResult = "win"));
            this.gameOver(false);
        }
        runInAction(() => {
            this.setPiece(to.column, to.row, {
                ...this.Pieces[from.row][from.column],
                name: pieceType,
            });
        });
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

    removeModal() {
        runInAction(() => <></>);
        runInAction(() => (this.isModal = false));
    }

    createModal(modalContents: any) {
        runInAction(() => (this.modalContents = modalContents));
        runInAction(() => (this.isModal = true));
    }

    setEnemyID(enemyID: string) {
        this.enemyID = enemyID;
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

    enterGame() {
        if (this.socket?.connected) {
            this.socket.emit(
                "enterGame",
                this.roomId,
                this.socket.id,
                (bool: boolean, gameSetting: { turnLimit: number }) => {
                    this.isWhite = false;
                    this.setTurnLimit(gameSetting.turnLimit);
                    this.setInGame(bool);
                    this.createModal(<Ready></Ready>);
                }
            );
        } else console.error("server is not connected");
    }

    movePiece(column: number, row: number) {
        if (this.socket?.connected) {
            if (this.isMyTurn === false || this.isModal) return;
            const from = {
                column: toJS(this.focused).column,
                row: toJS(this.focused).row,
            };
            const to = { column, row };
            if (
                to.row === 0 &&
                this.Pieces[from.row][from.column].name === "pawn"
            ) {
                this.createModal(<Promotion from={from} to={to}></Promotion>);
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
        this.socket.emit(
            "pieceMove",
            this.socket.id,
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
        this.socket.emit(
            "waitMyTurn",
            { playerID: this.socket.id, turnLimit: this.turnLimit },
            () => {
                runInAction(() => {
                    this.isMyTurn = true;
                });
            }
        );
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

    setReady(bool: boolean) {
        this.isReady = bool;
    }

    setEnemyReady(bool: boolean) {
        this.enemyReady = bool;
    }

    setTurnLimit(value: number) {
        this.turnLimit = value;
    }

    reduceCountDown() {
        if (this.countDown == 0) return;
        this.countDown -= 1;
    }

    setCountDown(number = 3) {
        this.countDown = number;
        this.createModal(<CountDown></CountDown>);
        let intervalId = setInterval(() => {
            this.reduceCountDown();
        }, 1000);
        setTimeout(() => {
            clearInterval(intervalId);
            this.removeModal();
        }, number * 1000);
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
