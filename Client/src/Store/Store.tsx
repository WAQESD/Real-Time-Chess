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
import { CountDown, GameOver } from "Components";

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
        return Math.max(
            160,
            (Math.max(this.windowWidth, this.windowHeight) -
                Math.min(this.windowWidth, this.windowHeight)) /
                2
        );
    }

    get tableSize() {
        return Math.max(
            240,
            Math.max(this.windowWidth, this.windowHeight) - 2 * this.infoSize
        );
    }

    isEnPassant(column: number, row: number) {
        let Piece = toJS(this.Pieces[row][column]);
        let lastGameLog = toJS(this.gameLog[this.gameLog.length - 1]);
        let checkLastMoveIsPawn =
            lastGameLog.name === "pawn" &&
            lastGameLog.to.column === column &&
            lastGameLog.to.row === row &&
            lastGameLog.from.column === column &&
            lastGameLog.from.row === row - 2;
        return (
            Piece.name === "pawn" &&
            Piece.isWhite !== this.isWhite &&
            checkLastMoveIsPawn
        );
    }

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.isReady,
            (isReady) => {
                if (isReady && this.enemyReady) {
                    setTimeout(() => {
                        this.setCountDown(3);
                    }, 1000);
                }
            }
        );
        reaction(
            () => this.enemyReady,
            (enemyReady) => {
                if (enemyReady && this.isReady) {
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
            (focused) => {
                if (this.inGame == false) return;
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
                        this.Pieces[row - 1][column - 1].name !== "empty" &&
                        this.Pieces[row - 1][column - 1].isWhite !==
                            this.isWhite
                    )
                        this.Pieces[row - 1][column - 1].canMoveNow = true;
                    if (
                        isInTable(row - 1, column + 1) &&
                        this.Pieces[row - 1][column + 1].name !== "empty" &&
                        this.Pieces[row - 1][column + 1].isWhite !==
                            this.isWhite
                    )
                        this.Pieces[row - 1][column + 1].canMoveNow = true;

                    if (
                        isInTable(row, column - 1) &&
                        this.gameLog.length > 0 &&
                        this.isEnPassant(row, column - 1)
                    )
                        this.Pieces[row - 1][column - 1].canMoveNow = true;
                    if (
                        isInTable(row, column + 1) &&
                        this.gameLog.length > 0 &&
                        this.isEnPassant(row, column + 1)
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
        let isEnPassant =
            pieceType === "pawn" &&
            this.Pieces[to.row][to.column].name === "empty";
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
            }
            this.setPiece(from.column, from.row, empty());
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
