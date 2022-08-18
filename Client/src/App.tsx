import { Main } from "Game";
import { Provider } from "mobx-react";
import { Store } from "Store";
import { useEffect } from "react";

const store = new Store();

const App = () => {
    useEffect(() => {
        store.connectSocket();
    });
    return (
        <Provider Store={store}>
            <Main />
        </Provider>
    );
};

export default App;
