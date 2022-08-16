import { ReactNode } from "react";
import { css } from "@emotion/react";

/** @jsxImportSource @emotion/react */
interface Props {
    children: ReactNode;
}

const container = css`
    width: 100%;
    height: 600px;
    dispaly: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
    border: black 2px dashed;
    flex-direction: column;
`;

const MainContainer = ({ children }: Props) => {
    return (
        <div css={container} style={{ display: "flex" }}>
            {children}
        </div>
    );
};

export default MainContainer;
