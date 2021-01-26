/*
game logic goes here
*/

//move to logic file in server
const rollDice = () => {
    const rand = Math.random();
    const diceRoll = (Math.floor(rand * 11) + 2);

    return diceRoll;
  };

  const movePlayer =(playerLoc) => {
    let passGO = false;
    const diceRollResult = rollDice();
    let newLoc = Number(playerLoc) + diceRollResult;
    const boardLength = 40; //not dynamic
    if (newLoc >= boardLength) {
      newLoc -= boardLength;
      passGO = true;
    }
    return {
      newLoc: newLoc,
      dice: diceRollResult,
      passGO: passGO,
      canBuy: false,
      paidRent: false,
    };
  };
/*
  buyProperty = (playerObj, spaceObj) => {
    if (spaceObj.owner !== BANK) {
      return "PlayerObj.owner already owns this property"
    } else if (playerObj.money < spaceObj.cost) {
      return "Sorry, you don't have enough money"
    }
    this.setState({
      spaceObj.owner: playerObj.name,
      playerObj.money: playerObj.money - spaceObj.cost
    });
  };
*/
module.exports = {
  movePlayer,
}