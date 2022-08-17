import { Main } from "Game";
import { Provider } from "mobx-react";
import { Store } from "Store";
import { useEffect } from "react";

const store = new Store();

const App = () => {
    useEffect(() => {
        store.connectSocket();
        return () => {
            if (store.socket?.connected) {
                if (store.isHost) {
                    store.socket.emit(
                        "closeGame",
                        store.socket.id,
                        (bool: boolean) => {
                            store.setInGame(bool);
                            store.setIsHost(bool);
                        }
                    );
                }
                store.disconnectSocket();
            }
        };
    });
    return (
        <Provider Store={store}>
            <Main />
        </Provider>
    );
};

export default App;
