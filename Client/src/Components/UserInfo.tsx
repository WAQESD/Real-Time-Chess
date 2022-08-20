import { css } from "@emotion/react";
import { Spacing } from "Components";

/** @jsxImportSource @emotion/react */

interface Props {
    infoSize: number;
    tableSize: number;
    isRow: boolean;
    isWhite: boolean;
    isMine: boolean;
    padding: number;
    fontSize: number;
}
const ColumnUserInfo = ({
    infoSize,
    tableSize,
    isRow,
    isWhite,
    isMine,
    padding,
    fontSize,
}: Props) => {
    const backgroundColor = isWhite
        ? "rgba(240, 217, 181, 0);"
        : "rgba(0, 0, 0, 0.9);";
    const UserInfo = {
        common: `
            background-color: ${backgroundColor};
            padding: ${padding}px;
            display: flex;
            color: ${isWhite ? "black" : "white"};
            font-size: ${fontSize}pt;
        `,
        columnContainer: `
            width: ${tableSize - 2 * padding}px;
            height: ${infoSize - 2 * padding}px;
        `,
        rowContainer: `
            height: ${tableSize - 2 * padding}px;
            width: ${infoSize - 2 * padding}px;
        `,
        upContainer: `
            flex-direction: row-reverse;
        `,
        downContainer: `
            flex-direction: row;
            align-items: flex-end;
        `,
        leftContainer: `
            flex-direction: column;
        `,
        rightContainer: `
            flex-direction: column;
            align-items: flex-end;
        `,
    };
    const containerCSS =
        UserInfo.common +
        (isRow
            ? UserInfo.rowContainer +
              (isMine ? UserInfo.rightContainer : UserInfo.leftContainer)
            : UserInfo.columnContainer +
              (isMine ? UserInfo.downContainer : UserInfo.upContainer));
    console.log(containerCSS);
    return (
        <div css={css(containerCSS)}>
            <img
                css={css`
                    filter: ${isWhite ? "" : "invert(1)"};
                `}
                src="img/Default_profile.svg"
                width="64px"
                height="64px"
            ></img>
            <Spacing spacing={8}></Spacing>
            <div
                css={css`
                    display: flex;
                    flex-direction: column;
                    align-items: ${(isMine && isRow) || (!isMine && !isRow)
                        ? "flex-end"
                        : "flex-start"};
                `}
            >
                <div
                    css={css`
                        font-weight: bold;
                        font-size: ${fontSize + 2}pt;
                    `}
                >
                    유저 이름
                </div>
                <Spacing spacing={2}></Spacing>
                <div
                    css={css`
                        overflow: hidden;
                    `}
                >
                    {"0승 0패 0무 (0.0%)"}
                </div>
            </div>
        </div>
    );
};

export default ColumnUserInfo;
