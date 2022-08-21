import { observer } from "mobx-react";
import { useStore } from "Store";
import { css } from "@emotion/react";
import { red, green } from "Constants/color";

/** @jsxImportSource @emotion/react */

const Ready = observer(() => {
    const { Store } = useStore();
    const container = css`
        display: grid;
        grid-template-row: 1fr 1fr 1fr;
        padding: 24px;
        font-family: Noto Sans KR;
        color: white;
        align-items: center;
        justify-items: center;
        border-radius: 8px;
        width: 260px;
        height: 250px;
    `;

    const buttonStyle = css`
        border: white 2px solid;
        color: white;
        grid-row: 3 / 4;
        background-color: rgba(0, 0, 0, 0);
        font-family: Noto Sans KR;
        font-size: 20pt;
        cursor: pointer;
        border-radius: 4px;
        padding: 2px 8px;
        &:hover {
            border: yellow 2px solid;
            color: yellow;
            padding: 2px 8px;
        }
    `;

    const ready = () => {
        Store.socket.emit("ready", Store.socket.id, () => {
            Store.setReady(true);
        });
    };

    const readyCancel = () => {
        Store.socket.emit("cancelReady", Store.socket.id, () => {
            Store.setReady(false);
        });
    };

    return (
        <div css={container}>
            {Store.isReady && Store.enemyReady ? undefined : (
                <div
                    css={css`
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        grid-row: 1/2;
                    `}
                >
                    <div>준비가 되면</div>
                    <div>버튼을 눌러주세요</div>
                </div>
            )}
            {!Store.enemyReady ? (
                <div
                    css={css`
                        color: ${red};
                        grid: 2/3;
                    `}
                >
                    상대방을 기다리는 중입니다
                </div>
            ) : undefined}
            {!Store.isReady && Store.enemyReady ? (
                <div
                    css={css`
                        color: ${green};
                        grid: 2/3;
                    `}
                >
                    상대방이 준비를 완료했습니다.
                </div>
            ) : undefined}
            {Store.isReady && Store.enemyReady ? (
                <div
                    css={css`
                        color: ${green};
                        grid: 1/4;
                    `}
                >
                    게임을 시작합니다
                </div>
            ) : undefined}
            {Store.isReady ? (
                Store.enemyReady ? undefined : (
                    <button css={buttonStyle} onClick={readyCancel}>
                        준비 취소
                    </button>
                )
            ) : (
                <button css={buttonStyle} onClick={ready}>
                    준 비
                </button>
            )}
        </div>
    );
});

export default Ready;
