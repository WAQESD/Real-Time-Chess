import { observer } from "mobx-react";
import { useStore } from "Store";
import { useEffect } from "react";
import { UserInfo, Table } from "Components";
import { css } from "@emotion/react";

/** @jsxImportSource @emotion/react */

const Game = observer(() => {
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
                isRow={Store.windowHeight < Store.windowWidth}
                isWhite={!Store.Game.isWhite}
                isMine={false}
                padding={Store.infoSize / 8}
                fontSize={Store.infoSize / 20}
            ></UserInfo>
            <Table></Table>
            <UserInfo
                isRow={Store.windowHeight < Store.windowWidth}
                isWhite={Store.Game.isWhite}
                isMine={true}
                padding={Store.infoSize / 8}
                fontSize={Store.infoSize / 20}
            ></UserInfo>
        </div>
    );
});

export default Game;
