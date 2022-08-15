import { observer } from "mobx-react";
import { useStore } from "Store";
import { Intro } from "Game";
import { MainContainer } from "Components";
import { useEffect } from "react";

const Main = observer(() => {
    const { Store } = useStore();
    useEffect(() => {}, [Store.isConnected]);
    return (
        <MainContainer>
            <Intro></Intro>
        </MainContainer>
    );
});

export default Main;
