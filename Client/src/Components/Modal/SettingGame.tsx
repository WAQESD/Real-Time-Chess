import { observer } from "mobx-react";
import { useStore } from "Store";
import { css } from "@emotion/react";
import { Spacing } from "Components";
import { WaitEnemyEnter } from "Components";
/** @jsxImportSource @emotion/react */

const SettingGame = observer(() => {
    const { Store } = useStore();
    const formStyle = css`
        color: white;
        font-size: 12pt;
        align-items: center;
        padding: 16px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    `;
    const container = css`
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    `;
    const selectStyle = css`
        border-radius: 2px;
        background-color: rgba(0, 0, 0, 0);
        color: white;
        border: none;
        font-family: Noto Sans KR;
        font-size: 12pt;
        text-align: end;
        cursor: pointer;
        &:hover {
            color: yellow;
        }
    `;

    const optionStyle = css`
        background-color: rgba(0, 0, 0, 0);
        color: black;
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

    const createGame = () => {
        Store.createModal(<WaitEnemyEnter></WaitEnemyEnter>);
    };

    const returnToMenu = () => {
        Store.removeModal();
    };
    return (
        <div css={formStyle}>
            <span>게임 설정</span>
            <Spacing spacing={8}></Spacing>
            <div css={container}>
                <span>제한시간</span>
                <Spacing spacing={4}></Spacing>
                <span>:</span>
                <Spacing spacing={4}></Spacing>
                <select
                    defaultValue={3000}
                    onChange={(event) =>
                        Store.Game.setTurnLimit(event.target.value)
                    }
                    css={selectStyle}
                    name="제한시간"
                >
                    <option css={optionStyle} value={1000}>
                        1 초
                    </option>
                    <option css={optionStyle} value={1500}>
                        1.5 초
                    </option>
                    <option css={optionStyle} value={2000}>
                        2 초
                    </option>
                    <option css={optionStyle} value={2500}>
                        2.5 초
                    </option>
                    <option css={optionStyle} value={3000}>
                        3 초
                    </option>
                </select>
            </div>
            <Spacing spacing={8}></Spacing>
            <button css={buttonStyle} onClick={createGame}>
                게임 생성하기
            </button>
            <Spacing spacing={4}></Spacing>
            <button css={buttonStyle} onClick={returnToMenu}>
                나가기
            </button>
        </div>
    );
});

export default SettingGame;
