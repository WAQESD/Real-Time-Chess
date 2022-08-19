import { observer } from "mobx-react";
import { useStore } from "Store";
import { Intro, InGame } from "Game";
import { MainContainer, Modal } from "Components";

const Main = observer(() => {
    const { Store } = useStore();
    return (
        <MainContainer>
            {Store.inGame ? <InGame></InGame> : <Intro></Intro>}
            {Store.isModal ? <Modal>{Store.modalContents}</Modal> : undefined}
        </MainContainer>
    );
});

export default Main;
