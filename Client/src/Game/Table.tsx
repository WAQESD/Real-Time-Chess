import { useStore } from "Store";
import { observer } from "mobx-react";
import { css } from "@emotion/react";
import { toJS, runInAction } from "mobx";
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

    const onClick = (column: number, row: number) => {
        if (Store.Pieces[row][column].canMoveNow) {
            if (Store.socket?.connected) {
                if (Store.isMyTurn === false) return;
                const from = {
                    column: toJS(Store.focused).column,
                    row: toJS(Store.focused).row,
                };
                const to = { column, row };
                Store.socket.emit(
                    "pieceMove",
                    Store.socket.id,
                    {
                        from,
                        to,
                    },
                    () => {
                        Store.moveTo(from, to);
                    }
                );
                Store.socket.emit("waitMyTurn", () => {
                    runInAction(() => {
                        Store.isMyTurn = true;
                    });
                });
            } else console.error("server is not connected");
        } else Store.setFocused(column, row);
    };

    const makeTableComponent = () => {
        return (
            <table
                style={{
                    width: Store.tableSize,
                    height: Store.tableSize,
                    borderCollapse: "collapse",
                    border: `2px solid ${Store.isMyTurn ? "green" : "red"} `,
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
                                    onClick={() => onClick(column, row)}
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
