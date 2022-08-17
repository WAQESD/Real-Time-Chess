import { useStore } from "Store";
import { observer } from "mobx-react";
import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */

const Table = observer(() => {
    const { Store } = useStore();
    const makeTableComponent = () => {
        const tableSize = Math.floor(
            Math.min(window.innerWidth, window.innerHeight)
        );

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

        return (
            <table
                style={{
                    width: tableSize,
                    height: tableSize,
                    borderCollapse: "collapse",
                }}
            >
                <tbody>
                    {[8, 7, 6, 5, 4, 3, 2, 1].map((num, row) => (
                        <tr key={num}>
                            {"abcdefgh".split("").map((alp, column) => (
                                <td
                                    css={(column + row) % 2 ? white : black}
                                    id={`${alp}${num}`}
                                    key={`${alp}${num}`}
                                >
                                    <img
                                        width={tableSize / 10}
                                        height={tableSize / 10}
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
