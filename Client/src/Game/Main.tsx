import { observer } from "mobx-react";
import { useStore } from "Store";
import { Intro, Table } from "Game";
import { MainContainer, Modal } from "Components";

const Main = observer(() => {
    const { Store } = useStore();
    return (
        <MainContainer>
            {Store.inGame ? <Table></Table> : <Intro></Intro>}
            {Store.isModal ? <Modal>{Store.modalContents}</Modal> : undefined}
        </MainContainer>
    );
});

export default Main;
