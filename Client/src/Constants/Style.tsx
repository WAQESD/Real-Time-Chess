import {
    whiteTileColor,
    BlackTileColor,
    focusedTileColor,
    canMoveTileColor,
    threatenedTileColor,
} from "Constants/Color";

const common = `
	margin: 0;
	padding: 0;
	cursor: pointer;
	text-align: center;
    `;

const table = {
    whiteTile: `background-color: ${whiteTileColor};` + common,

    blackTile: `background-color: ${BlackTileColor};` + common,

    focusedTile: `background-color: ${focusedTileColor};` + common,

    canMoveTile: `background-color: ${canMoveTileColor};` + common,

    threatenedTile: `background-color: ${threatenedTileColor};` + common,
};

export const style = {
    minTableSize: 240,
    minInfoSize: 240,
    table,
};
