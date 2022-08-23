import {
    whiteTileColor,
    BlackTileColor,
    focusedTileColor,
    canMoveTileColor,
} from "Constants/Color";

const table = {
    whiteTile: `
	background-color: ${whiteTileColor};
	margin: 0;
	padding: 0;
	cursor: pointer;
	text-align: center;`,

    blackTile: `
    background-color: ${BlackTileColor};
    margin: 0;
    padding: 0;
    cursor: pointer;
    text-align: center;`,

    focusedTile: `
    background-color: ${focusedTileColor};
    margin: 0;
    padding: 0;
    cursor: pointer;
    text-align: center;`,

    canMoveTile: `
    background-color: ${canMoveTileColor};
    margin: 0;
    padding: 0;
    cursor: pointer;
    text-align: center;
	`,
};

export const style = {
    minTableSize: 240,
    minInfoSize: 240,
    table,
};
