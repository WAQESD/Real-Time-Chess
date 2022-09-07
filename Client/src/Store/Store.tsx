import { makeAutoObservable, toJS, reaction, runInAction } from "mobx";
import { io } from "socket.io-client";
import { style } from "Constants/Style";
import { CountDown, GameOver, Promotion, Ready } from "Components";
import { Game } from "Store";
import {
    isInTable,
    flipPosition,
    getCanMoveTiles,
    getThreatenedTiles,
} from "Utils";

const ENDPOINT = "//localhost:3001/";

class Store {
    socket = io();
    roomId = "";
    inGame = false;
    isMatched = false;
    isHost = false;
    isModal = false;
    isReady = false;
    enemyReady = false;
    countDown = 3;
    enemyID = "";
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    modalContents = (<></>);
    Game = new Game(this);

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
            () => this.inGame,
            (inGame) => {
                if (inGame) {
                    this.Game.start();
                    this.socket.on(
                        "pieceMove",
                        ({ from, to, isWhite, pieceType }) => {
                            this.Game.moveTo(
                                flipPosition(from),
                                flipPosition(to),
                                isWhite,
                                pieceType
                            );
                            this.Game.setCanMoveNow();
                        }
                    );
                    this.socket.on("waitEnemyTurn", () => {
                        runInAction(() => (this.Game.isEnemyTurn = true));
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
                    gameResult={this.Game.gameResult}
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
        this.enemyID = "";
        this.Game.returnToLobby();
    }

    resizeAction() {
        runInAction(() => {
            this.windowWidth = window.innerWidth;
        });
        runInAction(() => {
            this.windowHeight = window.innerHeight;
        });
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

    enterGame() {
        if (this.socket?.connected) {
            this.socket.emit(
                "enterGame",
                this.roomId,
                this.socket.id,
                (bool: boolean, gameSetting: { turnLimit: number }) => {
                    this.Game.isWhite = false;
                    this.Game.setTurnLimit(gameSetting.turnLimit);
                    this.setInGame(bool);
                    this.createModal(<Ready></Ready>);
                }
            );
        } else console.error("server is not connected");
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
