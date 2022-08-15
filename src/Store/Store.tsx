import { makeAutoObservable, toJS, runInAction } from "mobx";
import { io } from "socket.io-client";

const ENDPOINT = "http://http://localhost:3000";

class Store {
    isConnected = false;
    socket = io(ENDPOINT, { transports: ["websocket"] });
    constructor() {
        makeAutoObservable(this);
    }

    initSocket() {
        if (this.socket) return;
        this.socket = io(ENDPOINT, { transports: ["websocket"] });
        runInAction(() => {
            this.isConnected = true;
        });
    }
}

export default Store;
