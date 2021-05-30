const socketManager = require("./server-socket");
const Player = require("./models/player");
const Space = require("./models/space");
const staticSpaces = require("./staticSpaces");
const BANK = staticSpaces.BANK;
const board = staticSpaces.board;

let countDownToGhostTurnCallback = null;

const getRandomLoc = () => {
  const rand = Math.random();
  const randomLoc = (Math.floor(rand * 40));
  return randomLoc;
};

const getTreasure = () => {
  const rand = Math.random();
  const treasure = (Math.floor(rand * 300));
  const rand1 = Math.random();
  if (rand1 < 0.5) {
    return (0 - treasure); 
  } else {
    return treasure;
  }
};
  
const handleRent = (player, dBSpace, moveResult, res) => {
  //get property owner player record
  Player.find({userId: dBSpace.ownerId}).then((owners) => {
    if (owners.length > 0) {
      const owner = owners[0]; 
      moveResult.ownerName = owner.name;
      if (!owner.ghost) {
        // owner actively playing, must pay rent
        moveResult.paidRent = true;
        const rent = dBSpace.numberOfBooths * moveResult.boardSpace.rentPerBooth;
        moveResult.rentAmount = rent;
        player.money -= rent; //TODO player has enogh money
        if (player.money <= 0) {
          //Player.deleteOne({userId: req.user._id}).then((p) => console.log("you ran out of money"));
        }
        //update owner money
        const owner = owners[0]; 
        owner.money += rent;
        owner.save(); //TODO notify owner client
      } 
    } else {
      console.log("Data Error: Can find owner "+dBSpace.ownerId+" for space "+moveResult.boardSpace.name);
      moveResult.ownerName = "unknown";
    }
    savePlayer(player, res, moveResult);
  });
}

const buildAndEmitStartTurnGameEventMessage = (player, moveResult) => {
  // build and emit gameEvent message
  let message = player.name+" rolled "+moveResult.dice.die1+", "+moveResult.dice.die2+" and moved to "+moveResult.name;
  if (moveResult.canBuy) {
    message += " which is up for sale";
  } 
  if (moveResult.ownerName !== staticSpaces.BANK) {
    if (moveResult.ownerName === player.name) {
      message += " which they own";
    } else {
      message += " owned by "+moveResult.ownerName;
      if (moveResult.paidRent) {
        message += " and paid rent of "+moveResult.rentAmount;
      } else {
        message += " but paid no rent";
      }
    }
  } 
  socketManager.getIo().emit("gameEvent", {event: message});
}

const savePlayer = (player, res, moveResult) => {
  player.save().then((player) => {
    moveResult.player = player; //display player bank
    res.send(moveResult); 
    const waitMS = countDownToGhostTurnCallback(player.ghost);
    socketManager.getIo().emit("newTurn", {gameStatus: "active", turnPlayer: player, timer: waitMS});
  });
  buildAndEmitStartTurnGameEventMessage(player, moveResult);
};

const handleMoveToOwnableSpace = (res, player, moveResult) => {
  //query database for new space record
  Space.find({space_id: moveResult.newLoc}).then((dBSpaces) => {
    const hasMoneyToBuy = (moveResult.boardSpace.cost <= player.money);

    if (dBSpaces.length === 0 || dBSpaces[0].owner === BANK) {
        // can buy because currently unowned or owned by bank
        moveResult.canBuy = hasMoneyToBuy;
        savePlayer(player, res, moveResult);
    } else {
      // cannot buy
      if (dBSpaces[0].ownerId === player.userId) {
          moveResult.ownerName = player.name;
          savePlayer(player, res, moveResult);
      } else {
          // must pay rent because its owned by another player
          handleRent(player, dBSpaces[0], moveResult, res);
      }
    }
  }); // close Space.find.then
}

const rollDice = () => {
    const rand = Math.random();
    const die1 = (Math.floor(rand * 6) + 1);
    const die2 = (Math.floor(rand * 6) + 1);
    const diceRoll = {
        die1: die1,
        die2: die2,
        isDouble: die1 === die2 ? true : false,
        total: die1 + die2,
    };
    return diceRoll;
};
  
const movePlayer = (playerLoc) => {
  let passGO = false;
  const diceRoll = rollDice();
  let newLoc = Number(playerLoc) + diceRoll.total;
  console.log("newLoc="+newLoc);
  const boardLength = 40; //not dynamic
  if (newLoc >= boardLength) {
      newLoc -= boardLength;
      passGO = true;
  }
  const boardSpace = board.spaces.find((staticSpace) => newLoc === staticSpace._id); //js find
  return {
      newLoc: newLoc,
      dice: diceRoll,
      passGO: passGO,
      canBuy: false,
      paidRent: false,
      ownerName: BANK,
      boardSpace: boardSpace,
  };
};

const startTurn = (player, res, ghost, countDownToGhostTurn) => {
  countDownToGhostTurnCallback = countDownToGhostTurn;
  player.ghost = ghost;
  player.didStartTurn = true;

  //roll dice, get new location- add GO money
  const moveResult = movePlayer(player.location);
  player.location = moveResult.newLoc;
  if (moveResult.passGO && !player.ghost) {
      player.money += 200;
  };
  console.log(player.name+" moved to "+moveResult.newLoc);
  
  // handle move to new space
  switch(moveResult.boardSpace.name) {
    case staticSpaces.GO:
      console.log("switch(moveResult.boardSpace.name):GO");
      savePlayer(player, res, moveResult);
      break;
    case staticSpaces.COMMUNITY_CHEST:
      console.log("switch(moveResult.boardSpace.name):CC");
      savePlayer(player, res, moveResult);
      break;
    case staticSpaces.CHANCE:
      console.log("switch(moveResult.boardSpace.name):CHANCE");
      savePlayer(player, res, moveResult);
      break;
    case staticSpaces.JAIL:
      console.log("switch(moveResult.boardSpace.name):JAIL");
      break;
    default:
      if (moveResult.boardSpace.canOwn) {
        console.log("handleMoveToOwnableSpace");
        handleMoveToOwnableSpace(res, player, moveResult);
      }
  }
};

module.exports = {
    startTurn,
}