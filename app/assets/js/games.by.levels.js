module.exports = {
  getGamesByLevel
};

const gameUnlockedArr = [];
let gameObj = {};

function getGamesByLevel(level) {

  return new Promise( (resolve, reject) => {
    for (let i = 1; i <= level; i++) {

      switch(i) {
        case 1:
          gameObj = {level: i, name: "One Million Skeletons", type: "Point & Click/RPG", file: "onemillionskeletons"};
          break;
        case 2:
          gameObj = {level: i, name: "3 Slices", type: "Logic", file: "3slices"};
          break;
        case 3:
          gameObj = {level: i, name: "Age of War", type: "Strategy/TD", file: "ageofwar"};
          break;
        case 4:
          gameObj = {level: i, name: "Awesome Tanks", type: "Shooter", file: "awesometanks"};
          break;
        case 5:
          gameObj = {level: i, name: "VectorTD", type: "Strategy/TD", file: "vectortd"};
          break;
        case 6:
          gameObj = {level: i, name: "Cursed Treasure - level pack", type: "Strategy/TD", file: "cursedtreasure"};
          break;
        case 7:
          gameObj = {level: i, name: "Earn to Die", type: "Platform/Shooter", file: "earntodie"};
          break;
        case 8:
          gameObj = {level: i, name: "Gemcraft Labyrinth", type: "Strategy/TD", file: "gemcraftlabyrinth"};
          break;
        case 9:
          gameObj = {level: i, name: "Moby Dick 2", type: "RPG", file: "mobydick2"};
          break;
        case 10:
          gameObj = {level: i, name: "Shadez", type: "Strategy/TD", file: "shadez"};
          break;
        case 11:
          gameObj = {level: i, name: "Shadez 2", type: "Strategy/TD", file: "shadez2"};
          break;
        case 12:
          gameObj = {level: i, name: "ZomboCalypse", type: "Shooter", file: "zombocalypse"};
          break;
        case 13:
          gameObj = {level: i, name: "Sonny", type: "Point & Click/RPG/Fighter", file: "sonny"};
          break;
        case 14:
          gameObj = {level: i, name: "Sonny 2", type: "Point & Click/RPG/Fighter", file: "sonny2"};
          break;
        case 15:
          gameObj = {level: i, name: "Jewel Quest", type: "Logic", file: "jewelquest"};
          break;
        case 16:
          gameObj = {level: i, name: "3D Superball", type: "Point & Click", file: "3d_superball"};
          break;
        case 17:
          gameObj = {level: i, name: "Slap the Nerd", type: "Point & Click", file: "slapthenerd"};
          break;
        case 18:
          gameObj = {level: i, name: "Poker - 5 pages", type: "Card game", file: "poker"};
          break;
        case 19:
          gameObj = {level: i, name: "Xtreme Cliff Diving", type: "Platform", file: "xtremecliffdiving"};
          break;
        case 20:
          gameObj = {level: i, name: "Gold Miner Vegas", type: "Point & Click", file: "goldminervegas"};
          break;
        case 21:
          gameObj = {level: i, name: "Death Worm", type: "Platform", file: "deathworm"};
          break;
        case 22:
          gameObj = {level: i, name: "Zigzag", type: "Logic", file: "zigzag"};
          break;
        case 23:
          gameObj = {level: i, name: "Poker Machine", type: "Logic", file: "pokermachine"};
          break;
        case 24:
          gameObj = {level: i, name: "3D Worm / Snake", type: "Platform", file: "3d_worm"};
          break;
        case 25:
          gameObj = {level: i, name: "Smileys War", type: "Shooter", file: "smileyswar"};
          break;
        case 26:
          gameObj = {level: i, name: "Tank Destroyer", type: "Shooter", file: "tankdestroyer"};
          break;
        case 27:
          gameObj = {level: i, name: "Symphony by Bee", type: "Point & Click", file: "symphony"};
          break;
        case 28:
          gameObj = {level: i, name: "Beer Monster", type: "Platform", file: "beermonster"};
          break;
        case 29:
          gameObj = {level: i, name: "Buggy Run", type: "Platform/Race", file: "buggyrun"};
          break;
        case 30:
          gameObj = {level: i, name: "Tricky Juggler - Where is the red?", type: "Logic", file: "trickyjuggler"};
          break;
        case 31:
          gameObj = {level: i, name: "Sonic - The Hedge Hog", type: "Platform", file: "sonicthehedgehog"};
          break;
        case 32:
          gameObj = {level: i, name: "TheAcrobats3", type: "Point & Click", file: "theacrobats3"};
          break;
        case 33:
          gameObj = {level: i, name: "Hit The Loser", type: "Point & Click", file: "hittheloser"};
          break;
        case 34:
          gameObj = {level: i, name: "WhipRound - Packman", type: "Point & Click", file: "whipRound-packman"};
          break;
        case 35:
          gameObj = {level: i, name: "Rugby", type: "Point & Click", file: "rugby"};
          break;
        case 36:
          gameObj = {level: i, name: "Infectonator 2", type: "Point & Click", file: "infectonator2"};
          break;
        case 37:
          gameObj = {level: i, name: "StreetFighter", type: "Platform/Fighter", file: "streetfighter"};
          break;
        case 38:
          gameObj = {level: i, name: "Yellow out", type: "Logic", file: "yellowout"};
          break;
        case 39:
          gameObj = {level: i, name: "Stick Trinity", type: "Platform/Fighter", file: "sticktrinity"};
          break;
        case 40:
          gameObj = {level: i, name: "Undead Hunter", type: "Shooter/Logic", file: "undeadhunter"};
          break;
        case 41:
          gameObj = {level: i, name: "Magic Sword", type: "Platform/Fighter", file: "magicsword"};
          break;
        case 42:
          gameObj = {level: i, name: "Thing Thing Area 3", type: "Shooter", file: "thingthingarea3"};
          break;
        case 43:
          gameObj = {level: i, name: "BoxHead Zombie Wars", type: "Shooter", file: "boxheadzombiewars"};
          break;
        case 44:
          gameObj = {level: i, name: "Gare", type: "Shooter", file: "gare"};
          break;
        case 45:
          gameObj = {level: i, name: "Eternal Red", type: "Shooter", file: "eternalred"};
          break;
        case 46:
          gameObj = {level: i, name: "Viktor", type: "Platform/Fighter", file: "viktor"};
          break;
        case 47:
          gameObj = {level: i, name: "Burst", type: "Shooter", file: "burst"};
          break;
        case 48:
          gameObj = {level: i, name: "Decision", type: "Shooter", file: "decision"};
          break;
        case 49:
          gameObj = {level: i, name: "Aliens Must Die", type: "Shooter", file: "aliensmustdie"};
          break;
        case 50:
          gameObj = {level: i, name: "Airfox", type: "Shooter", file: "airfox"};
          break;
      }
    
      gameUnlockedArr.push(gameObj);
      gameObj = {};

    }

    resolve(gameUnlockedArr);
  });
}
