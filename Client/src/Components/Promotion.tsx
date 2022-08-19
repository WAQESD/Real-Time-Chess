import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */

interface Props {
    isWhite: boolean;
    setNewPiece: (pieceName: string) => void;
    closeModal: () => void;
}

const selectablePiece = css`
    cursor: pointer;
`;

const Promotion = ({ isWhite, setNewPiece, closeModal }: Props) => {
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
                    setNewPiece(pieceType);
                    closeModal();
                }}
            ></img>
        ));
    };
    return <div>{seletablePieces(isWhite)}</div>;
};

export default Promotion;
