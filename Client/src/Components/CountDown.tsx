import { observer } from "mobx-react";
import { useStore } from "Store";
import { css } from "@emotion/react";
import { red } from "Constants/color";

/** @jsxImportSource @emotion/react */
const textStyle = css`
    font-size: 48pt;
    font-family: Noto Sans KR;
    color: ${red};
    width: 100px;
    height: 100px;
    text-align: center;
`;
const CountDown = observer(() => {
    const { Store } = useStore();
    return <span css={textStyle}>{Store.countDown}</span>;
});

export default CountDown;
