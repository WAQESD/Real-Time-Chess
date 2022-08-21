import { observer } from "mobx-react";
import { useStore } from "Store";
import { Spacing, Logo } from "Components";
import { SettingGame } from "Game";
import { css } from "@emotion/react";

/** @jsxImportSource @emotion/react */

const Intro = observer(() => {
    const { Store } = useStore();
    const makeNewGame = () => {
        if (Store.socket?.connected) {
            Store.createModal(<SettingGame></SettingGame>);
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
    const buttonStyle = css`
        font-family: Noto Sans KR;
        border: 2px solid black;
        background-color: rgba(0, 0, 0, 0);
        border-radius: 3px;
        cursor: pointer;
        &:hover {
            color: white;
            background-color: black;
            padding: 4px;
        }
        padding: 4px;
        font-size: 16pt;
    `;

    const inputStyle = css`
        font-family: Noto Sans KR;
        border: 1px solid black;
        border-radius: 3px;
        background-color: rgba(0, 0, 0, 0);
        padding: 2px;
        text-align: center;
        color: rgba(0, 0, 0, 0.7);
        &:focus {
            padding: 2px;
        }
    `;

    return (
        <div
            css={css`
                display: grid;
                grid-template-rows: 1fr 1fr 1fr;
                height: 100%;
                align-items: center;
            `}
        >
            <Logo fontSize={30}></Logo>
            <div
                css={css`
                    grid-row: 3/4;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                `}
            >
                <button css={buttonStyle} onClick={makeNewGame}>
                    게임 생성하기
                </button>
                <Spacing spacing={8} />
                <input
                    css={inputStyle}
                    type="text"
                    placeholder="게임 코드"
                    onChange={(event) => {
                        Store.roomId = event.target.value;
                    }}
                ></input>
                <Spacing spacing={3} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <button css={buttonStyle} onClick={enterGame}>
                        게임 입장하기
                    </button>
                </div>
            </div>
        </div>
    );
});

export default Intro;
