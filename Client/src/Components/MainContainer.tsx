import { ReactNode } from "react";
import { css } from "@emotion/react";

/** @jsxImportSource @emotion/react */
interface Props {
    children: ReactNode;
}

const container = css`
    dispaly: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
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
