import { makeAutoObservable, toJS, runInAction } from "mobx";
import { Piece, whiteSetUp, blackSetUp } from "Constants/defaultSetting";
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

    constructor() {
        makeAutoObservable(this);
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
