interface Props {
    infoSize: number;
    tableSize: number;
}

const RowUserInfo = ({ infoSize, tableSize }: Props) => {
    return (
        <div
            style={{
                backgroundColor: "black",
                height: tableSize,
                width: infoSize,
            }}
        ></div>
    );
};

export default RowUserInfo;
