import { observer } from "mobx-react";
import { useStore } from "Store";
import { Spacing } from "Components";

const Intro = observer(() => {
    const { Store } = useStore();
    const makeNewGame = () => {
        if (Store.socket?.connected) {
            Store.socket.emit(
                "makeNewGame",
                Store.socket.id,
                (response: string) => {
                    console.log(response);
                }
            );
        } else console.error("server is not connected");
    };
    const enterGame = () => {
        if (Store.socket?.connected) {
            Store.socket.emit(
                "enterGame",
                Store.roomId,
                Store.socket.id,
                (response: string) => {
                    console.log(response);
                }
            );
        } else console.error("server is not connected");
    };

    return (
        <>
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
