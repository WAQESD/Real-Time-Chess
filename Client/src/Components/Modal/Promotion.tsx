import { css } from "@emotion/react";
import { observer } from "mobx-react";
import { useStore } from "Store";
/** @jsxImportSource @emotion/react */

interface Props {
    from: { column: number; row: number };
    to: { column: number; row: number };
}

const selectablePiece = css`
    cursor: pointer;
`;

const Promotion = observer(({ from, to }: Props) => {
    const { Store } = useStore();
    const tableSize = Math.floor(
        Math.min(window.innerWidth, window.innerHeight)
    );

    const seletablePieces = (isWhite: boolean) => {
        return ["queen", "bishop", "knight", "rook"].map((pieceType) => (
            <img
                css={selectablePiece}
                key={pieceType}
                width={tableSize / 10}
                height={tableSize / 10}
                src={`img/Chess_${pieceType}_${
                    isWhite ? "white" : "black"
                }.svg`}
                onClick={() => {
                    Store.emitPieceMove(from, to, pieceType);
                    Store.removeModal();
                }}
            ></img>
        ));
    };
    return <div>{seletablePieces(Store.isWhite)}</div>;
});

export default Promotion;
