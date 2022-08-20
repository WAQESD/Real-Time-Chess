import { css } from "@emotion/react";
import { Spacing, Timer } from "Components";
import { useStore } from "Store";
import { observer } from "mobx-react";
import { userInfoStyle } from "Constants/userInfoStyle";

/** @jsxImportSource @emotion/react */

interface Props {
    isRow: boolean;
    isWhite: boolean;
    isMine: boolean;
    padding: number;
    fontSize: number;
}

const ColumnUserInfo = observer(
    ({ isRow, isWhite, isMine, padding, fontSize }: Props) => {
        const { Store } = useStore();
        const backgroundColor = isWhite
            ? "rgba(240, 217, 181, 0);"
            : "rgba(0, 0, 0, 0.9);";
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
                    <div css={userNameStyle}>유저 이름</div>
                    <Spacing spacing={2}></Spacing>
                    <div>0승 0패 0무 (0.0%)</div>
                </div>
                <Spacing spacing={8}></Spacing>
                <Timer
                    timerCss={timerStyle}
                    fontSize={Store.infoSize / 3}
                    isMyTurn={Store.isMyTurn}
                    lastTime={Store.lastTime}
                ></Timer>
            </div>
        );
    }
);

export default ColumnUserInfo;
