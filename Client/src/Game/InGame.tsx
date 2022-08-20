import { observer } from "mobx-react";
import { useStore } from "Store";
import { useEffect } from "react";
import { UserInfo } from "Components";
import { Table } from "Game";
import { css } from "@emotion/react";

/** @jsxImportSource @emotion/react */

const InGame = observer(() => {
    const { Store } = useStore();
    const rowContainer = css`
        display: flex;
        flex-direction: row;
    `;
    const columnContainer = css`
        display: flex;
        flex-direction: column;
        align-items: center;
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
        <div
            css={
                Store.windowHeight < Store.windowWidth
                    ? rowContainer
                    : columnContainer
            }
        >
            <UserInfo
                infoSize={Store.infoSize}
                tableSize={Store.tableSize}
                isRow={Store.windowHeight < Store.windowWidth}
                isWhite={!Store.isWhite}
                isMine={false}
                padding={24}
                fontSize={12}
            ></UserInfo>
            <Table></Table>
            <UserInfo
                infoSize={Store.infoSize}
                tableSize={Store.tableSize}
                isRow={Store.windowHeight < Store.windowWidth}
                isWhite={Store.isWhite}
                isMine={true}
                padding={24}
                fontSize={12}
            ></UserInfo>
        </div>
    );
});

export default InGame;
