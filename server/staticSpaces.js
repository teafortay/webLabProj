const BANK = "MIT";
const COMMUNITY_CHEST = "Community Chest";
const CHANCE = "Chance";

const board = {
    spaces: [
      {
        _id: 0,
        name: "GO",
        canOwn: false,
      }, {
        _id: 1,
        name: "Edgerton House",
        canOwn: true,
        owner: BANK,
        cost: 60,
        pricePerBooth: 50,
        rentPerBooth: 5,
        numberOfBooths: 0,
        color: "Purple",
      }, {
        _id: 2,
        name: COMMUNITY_CHEST,
        canOwn: false,
      }, {
          _id: 3,
        name: "Sydney Pacific",
        canOwn: true,
        owner: BANK,
        cost: 60,
        pricePerBooth: 50,
        rentPerBooth: 5,
        numberOfBooths: 0,
        color: "Purple",
      }, {
        _id: 4,
        name: "The Warehouse",
        canOwn: true,
        owner: BANK,
        cost: 70,
        pricePerBooth: 50,
        rentPerBooth: 5,
        numberOfBooths: 0,
        color: "Purple",
      }, {
        _id: 5,
        name: "Tech Shuttle Stop",
        canOwn: true,
        owner: BANK,
        cost: 200,
        pricePerBooth: 0,
        rentPerBooth: 20,
        numberOfBooths: 0,
        color: "Grey",
      }, {
          _id: 6,
        name: "Tang",
        canOwn: true,
        owner: BANK,
        cost: 100,
        pricePerBooth: 100,
        rentPerBooth: 10,
        numberOfBooths: 0,
        color: "LightBlue",
      }, {
        _id: 7,
        name: CHANCE,
        canOwn: false,
      }, {
          _id: 8,
        name: "Next House",
        canOwn: true,
        onwner: BANK,
        pricePerBooth: 100,
        rentPerBooth: 10,
        numberOfBooths: 0,
        color: "LightBlue",
      }, {
          _id: 9,
          name: "New House",
          canOwn: true,
          owner: BANK,
          cost: 100,
          pricePerBooth: 100,
          rentPerBooth: 10, 
          numberOfBooths: 0,
          color: "LightBlue",
      }, {
          _id: 10,
          name: "Jail",
          canOwn: false,
      }, {
        _id: 11,
        name: "MacGregor",
        canOwn: true,
        owner: BANK,
        cost: 140,
        pricePerBooth: 150,
        rentPerBooth: 15,
        numberOfBooths: 0,
        color: "DeepPink",
      }, {
        _id: 12,
        name: CHANCE,
        canOwn: false,
      }, {
          _id: 13,
        name: "Simmons",
        canOwn: true,
        owner: BANK,
        cost: 140,
        pricePerBooth: 150,
        rentPerBooth: 15,
        numberOfBooths: 0,
        color: "DeepPink",
      }, {
        _id: 14,
        name: "Random Hall",
        canOwn: true,
        owner: BANK,
        cost: 150,
        pricePerBooth: 150,
        rentPerBooth: 15,
        numberOfBooths: 0,
        color: "DeepPink",
      }, {
          _id: 15,
          name: "Tech Shuttle Stop",
          canOwn: true,
          owner: BANK,
          cost: 200, 
          pricePerBooth: 0,
          rentPerBooth: 20,
          numberOfBooths: 0,
          color: "Grey",
      }, {
          _id: 16,
        name: "Burton Conner",
        canOwn: true,
        owner: BANK,
        cost: 180,
        pricePerBooth: 200,
        rentPerBooth: 20,
        numberOfBooths: 0,
        color: "DarkOrange",
      }, {
        _id: 17,
        name: COMMUNITY_CHEST,
        canOwn: false,
      }, {
          _id: 18,
          name: "Baker",
          canOwn: true,
          owner: BANK,
          cost: 180,
          pricePerBooth: 200,
          rentPerBooth: 20, 
          numberOfBooths: 0,
          color: "DarkOrange",
      }, {
          _id: 19, 
          name: "McCormick",
          canOwn: true,
          owner: BANK,
          cost: 200,
          pricePerBooth: 200,
          rentPerBooth: 20, 
          numberOfBooths: 0,
          color: "DarkOrange",
      }, {
          _id: 20,
          name: "Free Parking",
          canOwn: false,
      }, {
          _id: 21,
          name: "Maseeh Hall",
          canOwn: true, 
          owner: BANK,
          cost: 230,
          pricePerBooth: 250,
          rentPerBooth: 25,
          numberOfBooths: 0,
          color: "red",
      }, {
          _id: 22,
          name: CHANCE,
          canOwn: false,
      }, {
          _id: 23,
          name: "Bexley",
          canOwn: true,
          owner: BANK,
          cost: 230,
          pricePerBooth: 250,
          rentPerBooth: 25,
          numberOfBooths: 0,
          color: "Red",
      }, {
          _id: 24,
          name: "Student Center",
          canOwn: true,
          owner: BANK,
          cost: 250,
          pricePerBooth: 250,
          rentPerBooth: 25, 
          numberOfBooths: 0,
          color: "red",
      }, {
          _id: 25,
          name: "Tech Shuttle Stop",
          canOwn: true,
          owner: BANK,
          cost: 200,
          pricePerBooth: 0,
          rentPerBooth: 20,
          numberOfBooths: 0,
          color: "gray",
      }, {
          _id: 26,
          name: "Lobby 7",
        canOwn: true,
        owner: BANK,
        cost: 270,
        pricePerBooth: 300,
        rentPerBooth: 30,
        numberOfBooths: 0,
        color: "Gold",
      }, {
        _id: 27,
        name: "Banana Lounge",
        canOwn: true,
        owner: BANK,
        cost: 300,
        pricePerBooth: 300,
        rentPerBooth: 30,
        numberOfBooths: 0,
        color: "Gold",
      }, {
        _id: 28,
        name: COMMUNITY_CHEST,
        canOwn: false,
      }, {
          _id: 29,
          name: "Stata Center",
          canOwn: true,
          owner: BANK, 
          cost: 300,
          pricePerBooth: 300,
          rentPerBooth: 30,
          numberOfBooths: 0,
          color: "Gold",
      }, {
          _id: 30,
          name: "Go to Jail",
          canOwn: false
      }, {
          _id: 31,
        name: "East Campus",
        canOwn: true,
        owner: BANK,
        cost: 330,
        pricePerBooth: 350,
        rentPerBooth: 35,
        numberOfBooths: 0,
        color: "green",
      }, {
        _id: 32,
        name: "Senior House",
        canOwn: true,
        owner: BANK,
        cost: 350,
        pricePerBooth: 350,
        rentPerBooth: 35,
        numberOfBooths: 0,
        color: "green",
      }, {
        _id: 33,
        name: COMMUNITY_CHEST,
        canOwn: false,
      }, {
          _id: 34,
          name: "Sloan School of Management",
          canOwn: true,
          owner: BANK,
          cost: 350,
          pricePerBooth: 350,
          rentPerBooth: 35,
          numberOfBooths: 0,
          color: "green",
      }, {
          _id: 35,
          name: "Tech Shuttle Stop",
          canOwn: true,
          owner: BANK,
          cost: 200,
          pricePerBooth: 0,
          rentPerBooth: 20,
          numberOfBooths: 0,
          color: "Grey",
      }, {
          _id: 36,
          name: "Site 4",
          canOwn: true,
          owner: BANK,
          cost: 400,
          pricePerBooth: 400,
          rentPerBooth: 40,
          numberOfBooths:0,
          color: "blue",
      }, {
          _id: 37,
        name: "Lobby 10",
        canOwn: true,
        owner: BANK,
        cost: 400,
        pricePerBooth: 400,
        rentPerBooth: 40,
        numberOfBooths: 0,
        color: "blue",
      }, {
          _id: 38,
          name: CHANCE,
          canOwn: false,
      }, {
          _id: 39,
          name: "Killian Court",
          canOwn: true,
          owner: BANK,
          cost: 400,
          pricePerBooth: 400,
          rentPerBooth: 40,
          numberOfBooths: 0,
          color: "blue",
      }
    ]
  };

  module.exports = {board};