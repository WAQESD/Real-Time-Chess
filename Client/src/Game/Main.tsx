import { observer } from "mobx-react";
import { useStore } from "Store";
import { Intro, Table } from "Game";
import { MainContainer } from "Components";
import { useEffect } from "react";

const Main = observer(() => {
    const { Store } = useStore();
    return (
        <MainContainer>
            {Store.inGame ? <Table></Table> : <Intro></Intro>}
        </MainContainer>
    );
});

export default Main;
