export const userInfoStyle = (
    backgroundColor: string,
    padding: number,
    isWhite: boolean,
    fontSize: number,
    tableSize: number,
    infoSize: number,
    isRow: boolean,
    isMine: boolean
): string => {
    const UserInfo = {
        common: `
            background-color: ${backgroundColor};
            padding: ${padding}px;
            display: flex;
            color: ${isWhite ? "black" : "white"};
            font-size: ${fontSize}pt;
        `,
        columnContainer: `
            width: ${tableSize - 2 * padding}px;
            height: ${infoSize - 2 * padding}px;
			display:grid;
			grid-template-columns: 1fr 1fr 1fr;
			grid-template-rows: 1fr 1fr 1fr;
			align-items: center;
			justify-items: center;
        `,
        rowContainer: `
            height: ${tableSize - 2 * padding}px;
            width: ${infoSize - 2 * padding}px;
        `,
        upContainer: `
            flex-direction: column;
        `,
        downContainer: `
            flex-direction: column-reverse;
        `,
        leftContainer: `
            flex-direction: column;
        `,
        rightContainer: `
            flex-direction: column;
            align-items: flex-end;
        `,
    };
    const containerStyle =
        UserInfo.common +
        (isRow
            ? UserInfo.rowContainer +
              (isMine ? UserInfo.rightContainer : UserInfo.leftContainer)
            : UserInfo.columnContainer +
              (isMine ? UserInfo.downContainer : UserInfo.upContainer));
    return containerStyle;
};
