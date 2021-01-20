/*
game logic goes here
*/

//functions use _, objects/vars are camel case
const roll_dice = () => {
const rand = Math.random();
const diceRoll = (Math.floor(rand * 11) + 2);
return diceRoll;
};