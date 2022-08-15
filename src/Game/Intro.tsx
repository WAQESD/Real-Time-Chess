import { observer } from "mobx-react";
import { useStore } from "Store";
import { Spacing } from "Components";
import { useEffect } from "react";

const Intro = observer(() => {
    const { Store } = useStore();
    const makeNewGame = () => {};
    const enterGame = () => {};
    useEffect(() => {}, [Store.isLoading]);

    return (
        <>
            <div>
                <span>유저이름</span>
                <span>:</span>
                <span>{Store?.userName ? Store.userName : "유저이름"}</span>
            </div>
            <Spacing spacing={8} />
            <button onClick={makeNewGame}>게임 생성하기</button>
            <Spacing spacing={8} />
            <button onClick={enterGame}>게임 입장하기</button>
        </>
    );
});

export default Intro;
