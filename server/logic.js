/*
game logic goes here
*/
const Player = require("./models/player");
const Space = require("./models/space");

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

  const ghostMove = (playerObj) => {
    //roll dice, move player

    //pay rent

    //call endTurn(false)

    //penalize?

  };

module.exports = {
  movePlayer,
}