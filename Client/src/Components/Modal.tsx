import { ReactNode } from "react";
import { css } from "@emotion/react";

/** @jsxImportSource @emotion/react */
interface Props {
    children: ReactNode;
}

const Modal = ({ children }: Props) => {
    const modal = css`
        position: absolute;
        top: ${window.innerHeight / 2};
        left: ${window.innerWidth / 2};
        background-color: rgba(0, 0, 0, 0.4);
        display: flex;
        flex-direction: column;
    `;
    return <div css={modal}>{children}</div>;
};

export default Modal;
