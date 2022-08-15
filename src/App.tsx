import { Main } from "Game";
import { Provider } from "mobx-react";
import { Store } from "Store";

const store = new Store();

const App = () => {
    return (
        <Provider Store={store}>
            <Main />
        </Provider>
    );
};

export default App;
