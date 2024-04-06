import { useState } from "preact/hooks";
import Die from "./Die";
import { getSocket } from "../pages/Home";

interface RollDiceProps {
  sides: string[];
}

export const RollDice = ({ sides }) => {
  const [die, setDie] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [rolling, setRolling] = useState<boolean>(false);

  setTimeout(() => {
    getSocket().on("roll", (income: string) => {
      if (!income) {
        setRolling(true);
      } else {
        setDie(JSON.parse(income))
        setTimeout(() => {
          setRolling(false)
        }, 1000)
      }
    });
  }, 2000)
  const roll = () => {
    getSocket().emit("roll", "")
    let arr = []
    for (let i = 0; i < 10; i++) {
      arr.push(Math.floor(Math.random() * sides) + 1)
    }
    getSocket().emit("roll", JSON.stringify(arr))
    // setDie1(math.floor(Math.random() * sides) + 1);
    // setDie2(Math.floor(Math.random() * sides) + 1);
    // setRolling(true);
    // setTimeout(() => {
    //   setRolling(false);
    // }, 1000);
  };

  const handleBtn = rolling ? 'RollDice-rolling' : '';

  return (
    <div className="RollDice">
      <div className="RollDice-container">

        {die?.map((die, i) => {
          // Return the element. Also pass key     
          return (<Die face={die} rolling={rolling} />)
        })}
      </div>
      <button className={handleBtn} disabled={rolling} onClick={roll}>
        {rolling ? 'Rolling' : 'Roll Dice!'}
      </button>
    </div>
  );
};
