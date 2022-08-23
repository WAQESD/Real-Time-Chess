import { css } from "@emotion/react";
import { Spacing } from "Components";
import { red, green } from "Constants/Color";
/** @jsxImportSource @emotion/react */

interface Props {
    fontSize: number;
    isTurn: boolean;
    lastTime: number;
    timerStyle: string;
}

const Timer = ({ fontSize, isTurn, lastTime, timerStyle }: Props) => {
    const timer = css(
        `
        font-family: LAB-digital;
        font-size: ${fontSize}px;
        color: ${isTurn ? green : red};
        display: flex;
    ` + timerStyle
    );
    const seconds = css`
        width: ${fontSize / 2 + 3}px;
    `;
    return (
        <div css={timer}>
            <div css={seconds}>{Math.floor(lastTime / 1000)}</div>
            <div>:</div>
            <Spacing spacing={1}></Spacing>
            <div css={seconds}>{Math.floor((lastTime % 1000) / 100)}</div>
            <div css={seconds}>{Math.floor((lastTime % 100) / 10)}</div>
        </div>
    );
};

export default Timer;
