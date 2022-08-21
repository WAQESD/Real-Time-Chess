import { observer } from "mobx-react";
import { useStore } from "Store";
import { Spacing } from "Components";
import { SettingGame } from "Game";

const Intro = observer(() => {
    const { Store } = useStore();
    const makeNewGame = () => {
        if (Store.socket?.connected) {
            Store.createModal(<SettingGame></SettingGame>);
            /*
            Store.socket.emit(
                "makeNewGame",
                Store.socket.id,
                (bool: boolean) => {
                    Store.isWhite = true;
                    Store.setPieces();
                    Store.setInGame(bool);
                    Store.setIsHost(bool);
                }
            );*/
        } else console.error("server is not connected");
    };
    const enterGame = () => {
        if (Store.socket?.connected) {
            Store.socket.emit(
                "enterGame",
                Store.roomId,
                Store.socket.id,
                (bool: boolean) => {
                    Store.isWhite = false;
                    Store.setPieces();
                    Store.setInGame(bool);
                }
            );
        } else console.error("server is not connected");
    };

    return (
        <>
            <Spacing spacing={16} />
            <button onClick={makeNewGame}>게임 생성하기</button>
            <Spacing spacing={8} />
            <div style={{ display: "flex", flexDirection: "column" }}>
                <input
                    type="text"
                    placeholder="room_id"
                    onChange={(event) => {
                        Store.roomId = event.target.value;
                    }}
                ></input>
                <Spacing spacing={4} />
                <button onClick={enterGame}>게임 입장하기</button>
            </div>
        </>
    );
});

export default Intro;
