import { ReactNode } from "react";
import { css } from "@emotion/react";

/** @jsxImportSource @emotion/react */
interface Props {
    children: ReactNode;
}

const MainContainer = ({ children }: Props) => {
    const container = css`
        display: flex;
        align-items: center;
        margin: 0;
        padding: 0;
        flex-direction: column;
        height: 100%;
        width: 100%;
    `;
    return <div css={container}>{children}</div>;
};

export default MainContainer;
