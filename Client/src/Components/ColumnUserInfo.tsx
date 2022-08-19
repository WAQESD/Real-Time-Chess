interface Props {
    infoSize: number;
    tableSize: number;
}

const ColumnUserInfo = ({ infoSize, tableSize }: Props) => {
    return (
        <div
            style={{
                backgroundColor: "black",
                width: tableSize,
                height: infoSize,
            }}
        ></div>
    );
};

export default ColumnUserInfo;
