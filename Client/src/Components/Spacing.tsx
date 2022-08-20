import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */

interface Props {
    spacing: number;
}

const Spacing = ({ spacing }: Props) => {
    return (
        <div
            css={css`
                margin: ${spacing}px;
            `}
        ></div>
    );
};

export default Spacing;
