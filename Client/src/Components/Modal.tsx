import { ReactNode } from "react";
import { css } from "@emotion/react";

/** @jsxImportSource @emotion/react */
interface Props {
    children: ReactNode;
}

const modalContainer = css`
    background-color: rgba(0, 0, 0, 0);
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Modal = ({ children }: Props) => {
    const modal = css`
        position: absolute;
        top: ${window.innerHeight / 2};
        left: ${window.innerWidth / 2};
        background-color: rgba(0, 0, 0, 0.95);
        padding: 4px;
        display: flex;
        flex-direction: column;
        border-radius: 4px;
    `;
    const preventEventPropagation = (event: any) => {
        event?.stopPropagation();
    };
    return (
        <div css={modalContainer} onClick={(e) => preventEventPropagation(e)}>
            <div css={modal}>{children}</div>
        </div>
    );
};

export default Modal;
