import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */

interface Props {
    fontSize: number;
}

const Logo = ({ fontSize }: Props) => {
    const container = css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        grid-row: 1/2;
    `;
    return (
        <div css={container}>
            <div
                css={css`
                    font-size: ${fontSize}pt;
                    margin-bottom: 8px;
                `}
            >
                Real - Time
            </div>
            <div
                css={css`
                    font-size: ${fontSize * 1.8}pt;
                `}
            >
                <span
                    css={css`
                        background-color: black;
                        color: white;
                        padding: 2px 8px;
                        border-radius: 4px;
                    `}
                >
                    Che
                </span>
                <span>ss</span>
            </div>
        </div>
    );
};

export default Logo;
