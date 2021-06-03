const socketManager = require("./server-socket");
const Player = require("./models/player");
const Space = require("./models/space");
const staticSpaces = require("./staticSpaces");
const player = require("./models/player");
const BANK = staticSpaces.BANK;
const board = staticSpaces.board;

let countDownToGhostTurnCallback = null;

const getRandomLoc = () => {
  const rand = Math.random();
  const randomLoc = (Math.floor(rand * 40));
  return randomLoc;
};
  
const handleRent = (res, player, moveResult, dBSpace) => {
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
    savePlayer(res, player, moveResult);
  });
}

const handleMoveToOwnableSpace = (res, player, moveResult) => {
  //query database for new space record
  Space.find({space_id: moveResult.newLoc}).then((dBSpaces) => {
    const hasMoneyToBuy = (moveResult.boardSpace.cost <= player.money);

    if (dBSpaces.length === 0 || dBSpaces[0].owner === BANK) {
        // can buy because currently unowned or owned by bank
        moveResult.canBuy = hasMoneyToBuy;
        savePlayer(res, player, moveResult);
    } else {
      // cannot buy
      if (dBSpaces[0].ownerId === player.userId) {
          moveResult.ownerName = player.name;
          savePlayer(res, player, moveResult);
      } else {
          // must pay rent because its owned by another player
          handleRent(res, player, moveResult, dBSpaces[0]);
      }
    }
  }); // close Space.find.then
}

const jail = (res, player, moveResult) => {
  if (player.jailTurns > 0) {
    player.jailTurns -= 1;
    if (player.jailTurns === 0) {
      moveResult.gotOutOfJail = true;
    }
    if (moveResult.dice.isDouble) {
      player.jailTurns = 0;
      moveResult.gotOutOfJail = true;
    }
  }
  savePlayer(res, player, moveResult);
};

const goToJail = (res, player, moveResult) => {
  player.jailTurns = 3;
  savePlayer(res, player, moveResult);
};

const buildAndEmitStartTurnGameEventMessage = (player, moveResult) => {
  let message =  player.name+" rolled "+moveResult.dice.die1+", "+moveResult.dice.die2;
  // build and emit gameEvent message
  if (moveResult.boardSpace.name === staticSpaces.JAIL) {
    if (moveResult.gotOutOfJail) {
      message += " and got out of jail";
    } else if (player.jailTurns === 0) {
      message += " and moved to Jail, but is just visiting";
    } else {
      message += " and is still in Jail";
    }
  } else if (moveResult.boardSpace.name === staticSpaces.GO_TO_JAIL) {
    message += " and is going to Jail for 3 turns";
  } else {
    message += " and moved to "+moveResult.boardSpace.name;
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
  }
  socketManager.getIo().emit("gameEvent", {event: message});
}

const savePlayer = (res, player, moveResult) => {
  player.save().then((player) => {
    moveResult.player = player; //display player bank
    res.send(moveResult); 
    const waitMS = countDownToGhostTurnCallback(player.ghost);
    socketManager.getIo().emit("newTurn", {gameStatus: "active", turnPlayer: player, timer: waitMS});
  });
  buildAndEmitStartTurnGameEventMessage(player, moveResult);
};

const rollDice = () => {
  const die1 = (Math.floor(Math.random() * 6) + 1);
  const die2 = (Math.floor(Math.random() * 6) + 1);
  const diceRoll = {
      die1: die1,
      die2: die2,
      isDouble: die1 === die2 ? true : false,
      total: die1 + die2,
  };
  return diceRoll;
};
  
const movePlayer = (player) => {
  let passGO = false;
  const diceRoll = rollDice();
  let newLoc = Number(player.location) + diceRoll.total;
  if (player.jailTurns > 0) {
    newLoc = staticSpaces.JAIL_ID;
  }
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
      gotOutOfJail: false,
  };
};

const startTurn = (res, player, ghost, countDownToGhostTurn) => {
  countDownToGhostTurnCallback = countDownToGhostTurn;
  player.ghost = ghost;
  player.didStartTurn = true;

  //roll dice, get new location- add GO money
  const moveResult = movePlayer(player);
  player.location = moveResult.newLoc;
  if (moveResult.passGO && !player.ghost) {
      player.money += 200;
  };
  console.log(player.name+" moved to "+moveResult.newLoc);
  
  // handle move to new space
  switch(moveResult.boardSpace.name) {
    // TODO: Debug non-buyable spaces.
    case staticSpaces.GO:
    case staticSpaces.FREE_PARKING:
    case staticSpaces.COMMUNITY_CHEST:  // handled in endturn()
      savePlayer(res, player, moveResult);
      break;
    case staticSpaces.JAIL:
      jail(res, player, moveResult);
      break;
    case staticSpaces.CHANCE:
      savePlayer(res, player, moveResult);
      break;
    case staticSpaces.GO_TO_JAIL:    
      goToJail(res, player, moveResult);
      break;
    default:
      if (moveResult.boardSpace.canOwn) {
        handleMoveToOwnableSpace(res, player, moveResult);
      }
  }
};

module.exports = {
    startTurn,
}