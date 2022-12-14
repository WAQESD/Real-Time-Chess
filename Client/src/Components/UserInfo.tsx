import { css } from "@emotion/react";
import { Spacing, Timer } from "Components";
import { useStore } from "Store";
import { observer } from "mobx-react";
import { userInfoStyle } from "Constants/UserInfoStyle";
import { white, black } from "Constants/Color";

/** @jsxImportSource @emotion/react */

interface Props {
    isRow: boolean;
    isWhite: boolean;
    isMine: boolean;
    padding: number;
    fontSize: number;
}
const win = Math.floor(Math.random() * 50);
const lose = Math.floor(Math.random() * 50);
const draw = Math.floor(Math.random() * 20);

const ColumnUserInfo = observer(
    ({ isRow, isWhite, isMine, padding, fontSize }: Props) => {
        const { Store } = useStore();
        const backgroundColor = isWhite ? white : black;
        const containerStyle = userInfoStyle(
            backgroundColor,
            padding,
            isWhite,
            fontSize,
            Store.tableSize,
            Store.infoSize,
            isRow,
            isMine
        );
        const profileStyle = css`
            grid-column: ${isMine ? "1 / 2" : "3 / 4"};
            grid-row: ${isMine ? "3 / 4" : "1 / 2"};
            filter: ${isWhite ? "" : "invert(1)"};
        `;
        const userNameStyle = css`
            font-weight: bold;
            font-size: ${fontSize + 2}pt;
        `;
        const nameWithWinrateStyle = css`
            grid-column: ${isMine ? "2 / 4" : "1 / 3"};
            grid-row: ${isMine ? "3 / 4" : "1 / 2"};
            display: flex;
            flex-direction: column;
            align-items: ${isRow
                ? isMine
                    ? "flex-end"
                    : "flex-start"
                : "center"};
        `;
        const timerStyle = `
            grid-column: 1 / 4;
            grid-row: ${isMine ? "1 / 2" : "3 / 4"};
        `;
        return (
            <div css={css(containerStyle)}>
                <img
                    css={profileStyle}
                    src="img/Default_profile.svg"
                    width="64px"
                    height="64px"
                ></img>
                <Spacing spacing={8}></Spacing>
                <div css={nameWithWinrateStyle}>
                    <div css={userNameStyle}>?????? ??????</div>
                    <Spacing spacing={2}></Spacing>
                    <div>{`${win}??? ${lose}??? ${draw}??? (${(
                        (win * 100) /
                        (win + lose + draw)
                    ).toFixed(1)}%)`}</div>
                </div>
                <Spacing spacing={8}></Spacing>
                <Timer
                    timerStyle={timerStyle}
                    fontSize={Store.infoSize / 3}
                    isTurn={
                        isWhite === Store.Game.isWhite
                            ? Store.Game.isMyTurn
                            : Store.Game.isEnemyTurn
                    }
                    lastTime={
                        isWhite === Store.Game.isWhite
                            ? Store.Game.myLastTime
                            : Store.Game.enemyLastTime
                    }
                ></Timer>
            </div>
        );
    }
);

export default ColumnUserInfo;
