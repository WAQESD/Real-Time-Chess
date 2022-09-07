import { observer } from "mobx-react";
import { useStore } from "Store";
import { Spacing, Ready } from "Components";
import { css } from "@emotion/react";
import { useEffect } from "react";
/** @jsxImportSource @emotion/react */

const WaitEnemy = observer(() => {
    const { Store } = useStore();

    useEffect(() => {
        let gameSetting = { turnLimit: Store.Game.turnLimit };
        Store.socket.emit("makeNewGame", Store.socket.id, gameSetting);
        Store.socket.on("enemyEnter", (enemyID: string) => {
            Store.Game.isWhite = true;
            Store.setEnemyID(enemyID);
            Store.setInGame(true);
            Store.setIsHost(true);
            Store.createModal(<Ready></Ready>);
        });
    });

    const container = css`
        display: flex;
        flex-direction: column;
        align-items: center;
        color: white;
        padding: 24px;
    `;
    const inputStyle = css`
        font-size: 10pt;
        padding: 6px 4px;
    `;

    const buttonStyle = css`
        background-color: rgba(0, 0, 0, 0);
        font-family: Noto Sans KR;
        font-size: 12pt;
        color: white;
        cursor: pointer;
        border: none;
        &:hover {
            color: yellow;
        }
    `;
    const onClick = () => {
        Store.removeModal();
        Store.socket.emit("closeGame", Store.socket.id);
    };

    return (
        <div css={container}>
            <div>상대방에게 코드를 알려주세요</div>
            <Spacing spacing={6}></Spacing>
            <input css={inputStyle} readOnly value={Store.socket.id}></input>
            <Spacing spacing={8}></Spacing>
            <button css={buttonStyle} onClick={onClick}>
                나가기
            </button>
        </div>
    );
});

export default WaitEnemy;
