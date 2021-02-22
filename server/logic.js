/*
game logic goes here
*/

const socketManager = require("./server-socket");
const Player = require("./models/player");
const Space = require("./models/space");

const staticSpaces = require("./staticSpaces");

const board = staticSpaces.board;
const BANK = staticSpaces.BANK;

const dummyRes = {send: () => {}};//don't need statu?

// timer used to make ghost turns
let timer = null;

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

const getPlayer = (userId, res) => {
  // Search for this player
  Player.find({userId: userId}).then((players) => {
    if (players.length === 0) {
      // player not found, make a new one and save
      const newPlayer = new Player({
        userId: req.user._id,
        name: req.user.name,
        money: 2500,
        location: 0,
        isTurn: false,
        didStartTurn: false,
        ghost: false,
      });
      newPlayer.save().then((player) => {
        res.send(player);
      });
    } else {
      // return the found player
      const curPlayer = players[0];
      res.send(curPlayer);
    }
  });
};

const incrementTurn = (curPlayerUserId) => {
  Player.find({}).then((players) => {
    // determine if any players are active
    const playersActive = ( players.find((p) => !p.ghost) != undefined ); // javascript find
    console.log("playersActive="+playersActive);
    if (!playersActive) { 
      const dummyPlayer = {userId: "", 
                          name: "", money: 0, location: 0, 
                          isTurn: false, didStartTurn: false, ghost: true}
      socketManager.getIo().emit("newTurn", {gameStatus: "hold", turnPlayer: dummyPlayer, timer: 0});
      return;
    };

    // loop through each player looking for current player
    for (let index = 0; index < players.length; index++) {
      if (players[index].userId === curPlayerUserId) {
        // find next player
        let nextTurnIndex = index + 1 >= players.length ? 0 : index + 1;
        const nextPlayer = players[nextTurnIndex];
        console.log("nextPlayer="+nextPlayer.name+" "+nextPlayer.ghost);
        nextPlayer.isTurn = true;
        nextPlayer.save().then((nextPlayer) => {
          const waitMS = countDownToGhostTurn(nextPlayer.ghost);
          socketManager.getIo().emit("newTurn", {gameStatus: "active", turnPlayer: nextPlayer, timer: waitMS});
        });
        break;
      } 
    }
  });
};

const requestTurn = (userId, res) => {
  Player.find({userId: userId}).then((players) => {
    if (players.length === 0) {
      return res.status(409).send({ err: "Can not find user" }); 
    }
    const curPlayer = players[0];
    curPlayer.ghost = false; // turn off ghost mode
    Player.find({isTurn: true}).then((isTurnPlayers) => {
      let waitMS = 0;
      if (isTurnPlayers.length === 0) {
        // no player has the turn 
        // set turn to requesting player and start timer
        curPlayer.isTurn = true;
        waitMS = countDownToGhostTurn(curPlayer.ghost);
      } else {
        // make sure timer is set for player with the turn
        // should only be needed when data is bad and needs cleanup
        waitMS = countDownToGhostTurn(isTurnPlayers[0].ghost);
      }
      curPlayer.save().then((player) => {
        res.send(player);
        if (player.isTurn) {
          socketManager.getIo().emit("newTurn", {gameStatus: "active", turnPlayer: player, timer: waitMS});
        }
      });
    });
  });
};

const requestMoreTime = (userId, res) => {
  //get player
  Player.find({userId: userId}).then((players) => {
    if (players.length === 0) {
      return res.status(401).send({ err: "Can't find player with id:"+userId}); //works?
    }
    const player = players[0];  
    if (!player.isTurn) {
      return res.status(401).send({ err: "not your turn" }); //works?
    }
    clearTimer();
    const waitMS = countDownToGhostTurn(false, 25000);
    socketManager.getIo().emit("newTurn", {gameStatus: "active", turnPlayer: player, timer: waitMS});
    res.send({result: "approved"});
  });
}

const startTurn = (userId, res, ghost) => {
  //get player
  Player.find({userId: userId}).then((players) => {
    if (players.length === 0) {
      return res.status(401).send({ err: "Can't find player with id:"+userId}); //works?
    }
    const player = players[0];
    if (!player.isTurn || player.didStartTurn) {
      return res.status(401).send({ err: "not your turn" }); //works?
    }
    clearTimer();
    player.ghost = ghost;
    player.didStartTurn = true;
    const oldLoc = player.location;
    //roll dice, get new location- add GO money
    const result = movePlayer(oldLoc);
    player.location = result.newLoc;
    if (result.passGO) {
      player.money += 200;
    };
    //query database for new location space
    Space.find({space_id: result.newLoc}).then((dBSpaces) => {
      const s = board.spaces.find((staticS) => result.newLoc === staticS._id); //js find
      if (dBSpaces.length > 0) {
        const dBSpace = dBSpaces[0];
        if (dBSpace.owner === BANK && s.cost <= player.money) { //TODO recycling
          //buy
          result.canBuy = true; 
        } else if (dBSpace.ownerId !== userId) {
          result.paidRent = true;
          //pay rent - update user money
          const rent = dBSpace.numberOfBooths * s.rentPerBooth;
          player.money -= rent; //TODO player has enogh money
          if (player.money <= 0) {
            //Player.deleteOne({userId: req.user._id}).then((p) => console.log("you ran out of money"));
          }
          //update owner money
          Player.find({userId: dBSpace.ownerId}).then((owners) => {
            if (owners) {
              const owner = owners[0]; 
            owner.money += rent;
            owner.save(); //TODO notify owner client
            }
            
          });
        }
      } else  if (s.canOwn && s.cost <= player.money) {
        //space not found in database
        result.canBuy = true; 
      }
      //update database
      player.save().then((player) => {
        result.player = player; //display player bank
        res.send(result); 
        const waitMS = countDownToGhostTurn(ghost);
        socketManager.getIo().emit("newTurn", {gameStatus: "active", turnPlayer: player, timer: waitMS});
      })
    }); //space.find.then
  }); //player.find.then
};

const endTurn = (userId, res, boughtProperty, ghost) => {
  //get player
  Player.find({userId: userId}).then((players) => {
    const player = players[0]; //TODO check nonempty?
    if (!player.isTurn) {
      console.log("401: not your turn");
      return res.status(401).send({ err: "not your turn" });
    }
    if (!player.didStartTurn) {
      console.log("401: Did not start turn");
      return res.status(401).send({ err: "Did not start turn" });
    }
    player.ghost = ghost;
    player.isTurn = false;
    player.didStartTurn = false;
    clearTimer();
    //handle buying property
    const space = board.spaces.find((staticS) => player.location === staticS._id); //js find
      
    if (boughtProperty && space.canOwn && player.money >= space.cost) { 
      player.money -= space.cost;
      Space.find({space_id: space._id}).then((dBSpaces) => {
        if (dBSpaces.length > 0) {
          const dBSpace = dBSpaces[0];
          dBSpace.ownerId = player.userId;
          dBSpace.owner = player.name;
          dBSpace.numberOfBooths =1;
          dBSpace.save();
        } else {
          const newSpace = new Space({
            space_id: space._id,
            owner: player.name,
            ownerId: player.userId,
            numberOfBooths: 1,
          });
          newSpace.save();
        } //TODO turns DONE?
        closeoutPlayer(player, res);
      }); //space.find.then
    } else { ///if not bought property 
      closeoutPlayer(player, res);
    }
  }); //player.find.then
}

const closeoutPlayer = (player, res) => {
  player.save().then((p) => {
    res.send(p);
    incrementTurn(p.userId);
  });
};

const countDownToGhostTurn = (ghost, requestedTime) => {
  // exit if timer already set
  if (timer) {
    console.log("Timer already set");
    return 0;
  }
  let waitMS = ghost ? 5000 : 12000;
  if (typeof requestedTime != "undefined") {
    waitMS = requestedTime;
  }
  console.log("Setting timer: "+ waitMS);
  timer = setTimeout(() => {
    timer = null;
    // get layer whose turn it is
    Player.find({isTurn: true}).then((players) => {
      if (players.length === 0) {
        return;
      }
      const player = players[0];
      console.log("Ghost Turn for "+player.name);
      if (player.didStartTurn) {
        endTurn(player.userId, dummyRes, false, true);
      } else {
        startTurn(player.userId, dummyRes, true);
      }
    });
  }, waitMS);
  return waitMS;
};

const clearTimer = () => {
  if (timer) {
    clearTimeout(timer);
    console.log("Clearing timer");
    timer = null;
  }
};

module.exports = {
  getPlayer,
  requestTurn,
  requestMoreTime,
  startTurn,
  endTurn,
}