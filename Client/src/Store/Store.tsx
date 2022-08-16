import { makeAutoObservable, toJS, runInAction } from "mobx";
import { io } from "socket.io-client";

const ENDPOINT = "//localhost:3001/";

class Store {
    socket = io();
    roomId = "";
    constructor() {
        makeAutoObservable(this);
    }

    connectSocket() {
        if (this.socket?.connected) return;
        this.socket = io(ENDPOINT, { transports: ["websocket"] });
    }

    disconnectSocket() {
        if (this.socket?.connected) return;
        this.socket.disconnect();
    }
}

export default Store;
