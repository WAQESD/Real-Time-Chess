import { useStore } from "Store";
import { observer } from "mobx-react";
import { css } from "@emotion/react";
import { toJS } from "mobx";
import { Promotion } from "Components";
import { red, green } from "Constants/color";
/** @jsxImportSource @emotion/react */

const white = css`
    background-color: #f0d9b5;
    margin: 0;
    padding: 0;
    cursor: pointer;
    text-align: center;
`;
const black = css`
    background-color: #b58863;
    margin: 0;
    padding: 0;
    cursor: pointer;
    text-align: center;
`;
const focus = css`
    background-color: #f8ec5b;
    margin: 0;
    padding: 0;
    cursor: pointer;
    text-align: center;
`;

const canMoveNow = css`
    background-color: #e0d030;
    margin: 0;
    padding: 0;
    cursor: pointer;
    text-align: center;
`;

const Table = observer(() => {
    const { Store } = useStore();
    const getCSSbyPosition = (column: number, row: number) => {
        if (Store.Pieces[row][column].isFocused) return focus;
        else if (Store.Pieces[row][column].canMoveNow) return canMoveNow;
        else return (column + row) % 2 ? black : white;
    };

    const onMouseDown = (column: number, row: number) => {
        if (Store.Pieces[row][column].canMoveNow) {
            if (Store.socket?.connected) {
                if (Store.isMyTurn === false || Store.isModal) return;
                const from = {
                    column: toJS(Store.focused).column,
                    row: toJS(Store.focused).row,
                };
                const to = { column, row };
                if (
                    to.row === 0 &&
                    Store.Pieces[from.row][from.column].name === "pawn"
                ) {
                    Store.createModal(
                        <Promotion from={from} to={to}></Promotion>
                    );
                } else {
                    Store.emitPieceMove(
                        from,
                        to,
                        Store.Pieces[from.row][from.column].name
                    );
                }
            } else console.error("server is not connected");
        } else if (Store.Pieces[row][column].isFocused)
            Store.setFocused(-1, -1);
        else Store.setFocused(column, row);
    };

    const makeTableComponent = () => {
        return (
            <table
                style={{
                    width: Store.tableSize,
                    height: Store.tableSize,
                    borderCollapse: "collapse",
                    border: `2px solid ${Store.isMyTurn ? green : red} `,
                }}
            >
                <tbody>
                    {[8, 7, 6, 5, 4, 3, 2, 1].map((num, row) => (
                        <tr key={num}>
                            {"abcdefgh".split("").map((alp, column) => (
                                <td
                                    css={getCSSbyPosition(column, row)}
                                    id={`${alp}${num}`}
                                    key={`${alp}${num}`}
                                    onMouseDown={() => onMouseDown(column, row)}
                                >
                                    <img
                                        width={Store.tableSize / 10}
                                        height={Store.tableSize / 10}
                                        src={`img/Chess_${
                                            Store.Pieces[row][column].name
                                        }_${
                                            Store.Pieces[row][column].isWhite
                                                ? "white"
                                                : "black"
                                        }.svg`}
                                    ></img>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return makeTableComponent();
});

export default Table;
