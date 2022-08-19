import { observer } from "mobx-react";
import { useStore } from "Store";
import { useEffect } from "react";
import { RowUserInfo, ColumnUserInfo } from "Components";
import { Table } from "Game";
import { css } from "@emotion/react";

/** @jsxImportSource @emotion/react */

const InGame = observer(() => {
    const { Store } = useStore();
    const rowContainer = css`
        display: flex;
        flex-direction: row;
        background-color: ${Store.isMyTurn ? "green" : "red"};
    `;
    const columnContainer = css`
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: ${Store.isMyTurn ? "green" : "red"};
    `;
    const handleResize = () => {
        Store.resizeAction();
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    });

    return (
        <>
            {Store.windowHeight > Store.windowWidth ? (
                <div css={columnContainer}>
                    <ColumnUserInfo
                        infoSize={Store.infoSize}
                        tableSize={Store.tableSize}
                    ></ColumnUserInfo>
                    <Table></Table>
                    <ColumnUserInfo
                        infoSize={Store.infoSize}
                        tableSize={Store.tableSize}
                    ></ColumnUserInfo>
                </div>
            ) : (
                <div css={rowContainer}>
                    <RowUserInfo
                        infoSize={Store.infoSize}
                        tableSize={Store.tableSize}
                    ></RowUserInfo>
                    <Table></Table>
                    <RowUserInfo
                        infoSize={Store.infoSize}
                        tableSize={Store.tableSize}
                    ></RowUserInfo>
                </div>
            )}
        </>
    );
});

export default InGame;
