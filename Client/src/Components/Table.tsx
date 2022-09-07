import { useStore } from "Store";
import { observer } from "mobx-react";
import { css } from "@emotion/react";
import { red, green } from "Constants/Color";
import { style } from "Constants/Style";

/** @jsxImportSource @emotion/react */

const Table = observer(() => {
    const { Store } = useStore();

    const tableStyle = css`
        width: ${Store.tableSize}px;
        height: ${Store.tableSize}px;
        border-collapse: collapse;
        border: 2px solid ${Store.Game.isMyTurn ? green : red};
    `;

    const getStyleByPosition = (column: number, row: number) => {
        if (Store.Game.Pieces[row][column].isFocused)
            return css(style.table.focusedTile);
        else if (Store.Game.Pieces[row][column].canMoveNow)
            return css(style.table.canMoveTile);
        else
            return (column + row) % 2
                ? css(style.table.blackTile)
                : css(style.table.whiteTile);
    };

    const onMouseDown = (column: number, row: number) => {
        if (Store.Game.Pieces[row][column].canMoveNow)
            Store.Game.movePiece(column, row);
        else if (Store.Game.Pieces[row][column].isFocused)
            Store.Game.setFocused(-1, -1);
        else Store.Game.setFocused(column, row);
    };

    const makeTableComponent = () => {
        return (
            <table css={tableStyle}>
                <tbody>
                    {[8, 7, 6, 5, 4, 3, 2, 1].map((num, row) => (
                        <tr key={num}>
                            {"abcdefgh".split("").map((alp, column) => (
                                <td
                                    css={getStyleByPosition(column, row)}
                                    id={`${alp}${num}`}
                                    key={`${alp}${num}`}
                                    onMouseDown={() => onMouseDown(column, row)}
                                >
                                    <img
                                        width={Store.tableSize / 10}
                                        height={Store.tableSize / 10}
                                        src={`img/Chess_${
                                            Store.Game.Pieces[row][column].name
                                        }_${
                                            Store.Game.Pieces[row][column]
                                                .isWhite
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
