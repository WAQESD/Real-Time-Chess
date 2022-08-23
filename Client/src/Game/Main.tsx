import { observer } from "mobx-react";
import { useStore } from "Store";
import { Lobby, Game } from "Game";
import { MainContainer, Modal } from "Components";

const Main = observer(() => {
    const { Store } = useStore();
    return (
        <MainContainer>
            {Store.inGame ? <Game></Game> : <Lobby></Lobby>}
            {Store.isModal ? <Modal>{Store.modalContents}</Modal> : undefined}
        </MainContainer>
    );
});

export default Main;
