import { css } from "@emotion/react";
import { Spacing } from "Components";
/** @jsxImportSource @emotion/react */

interface Props {
    fontSize: number;
    isMyTurn: boolean;
    lastTime: number;
    timerCss: string;
}

const Timer = ({ fontSize, isMyTurn, lastTime, timerCss }: Props) => {
    const timer = css(
        `
        font-family: LAB-digital;
        font-size: ${fontSize}px;
        color: ${isMyTurn ? "#1ADB6A" : "#DB0E00"};
        display: flex;
    ` + timerCss
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
