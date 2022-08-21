import { css } from "@emotion/react";
import { red, green } from "Constants/color";
/** @jsxImportSource @emotion/react */

interface Props {
    gameResult: string;
    enemyExit: boolean;
    onClick: () => void;
}

const container = css`
    display: grid;
    grid-template-rows: 1fr 2fr 1fr;
    grid-template-columns: 1fr 4fr 1fr;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-family: Noto Sans KR;
    width: 300px;
    height: 300px;
    border-radius: 8px;
    padding: 16px 0px;
`;

const resultStyle = `
	font-size: 32pt;
	grid-row: 1 / 2;
    grid-column: 2 / 3;
`;

const buttonStyle = css`
    border: white 2px solid;
    color: white;
    grid-row: 3 / 4;
    grid-column: 2 / 3;
    background-color: rgba(0, 0, 0, 0);
    font-size: 16pt;
    cursor: pointer;
    border-radius: 4px;
    padding: 2px 8px;
    &:hover {
        border: yellow 2px solid;
        color: yellow;
        padding: 2px 8px;
    }
`;
const enemyExitText = css`
    color: ${green};
    font-size: 12pt;
    grid-row: 2/3;
    grid-column: 2 / 3;
    text-align: center;
`;

const GameOver = ({ gameResult, enemyExit, onClick }: Props) => {
    return (
        <div css={container}>
            {gameResult === "win" ? (
                <div css={css(resultStyle + `color:${green}`)}>승 리</div>
            ) : undefined}
            {gameResult === "lose" ? (
                <div css={css(resultStyle + `color:${red}`)}>패 배</div>
            ) : undefined}
            {gameResult === "draw" ? (
                <div css={css(resultStyle + `color:gray`)}>무승부</div>
            ) : undefined}
            {enemyExit ? (
                <div css={enemyExitText}>상대방이 나갔습니다</div>
            ) : undefined}
            <button css={buttonStyle} onClick={onClick}>
                나가기
            </button>
        </div>
    );
};

export default GameOver;
