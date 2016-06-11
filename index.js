$(document).ready(function() {

  var stage = new createjs.Stage("canvas");
  var display, interval, i;
  //
  //Rendering all the pad shapes
  //
  var greenShape = new createjs.Shape();
  greenShape.graphics.beginFill("#1e7739").drawRect(0, 0, 150, 150); //#0cf453

  var redShape = new createjs.Shape();
  redShape.graphics.beginFill("#773127").drawRect(150, 0, 150, 150); //#ef2106

  var yellowShape = new createjs.Shape();
  yellowShape.graphics.beginFill("#7c7b1f").drawRect(0, 150, 150, 150); //#f1ee09

  var blueShape = new createjs.Shape();
  blueShape.graphics.beginFill("#215477").drawRect(150, 150, 150, 150); //#189ffe

  stage.addChild(greenShape, redShape, yellowShape, blueShape);

  createjs.Ticker.setFPS(60);
  createjs.Ticker.on("tick", stage);

  //audio
  var greenSound = $("#green")[0];
  var redSound = $("#red")[0];
  var yellowSound = $("#yellow")[0];
  var blueSound = $("#blue")[0];
  var errorSound = $("#error")[0];
  errorSound.volume = 0.3;

  //
  //simon object holding all important properties
  //
  var simon = {
    level: 1,
    isOn: false,
    isStrict: "strict",
    start: false,
    playerTurn: false,
    colors: ["green", "red", "yellow", "blue"],
    botCache: [],
    playerCache: [],
    errorSound: function() {
      errorSound.play();
    },
    green: {
      light: function() {
        createjs.Tween.get(greenShape).call(function() {
          greenShape.graphics.beginFill("#0cf453").drawRect(0, 0, 150, 150);
        }).wait(800).call(function() {
          greenShape.graphics.beginFill("#1e7739").drawRect(0, 0, 150, 150);
        });
      },
      sound: function() {
        greenSound.play();
      }
    },
    red: {
      light: function() {
        createjs.Tween.get(redShape).call(function() {
          redShape.graphics.beginFill("#ef2106").drawRect(150, 0, 150, 150);
        }).wait(800).call(function() {
          redShape.graphics.beginFill("#773127").drawRect(150, 0, 150, 150);
        });
      },
      sound: function() {
        redSound.play();
      }
    },
    yellow: {
      light: function() {
        createjs.Tween.get(yellowShape).call(function() {
          yellowShape.graphics.beginFill("#f1ee09").drawRect(0, 150, 150, 150);
        }).wait(800).call(function() {
          yellowShape.graphics.beginFill("#7c7b1f").drawRect(0, 150, 150, 150);
        });
      },
      sound: function() {
        yellowSound.play();
      }
    },
    blue: {
      light: function() {
        createjs.Tween.get(blueShape).call(function() {
          blueShape.graphics.beginFill("#189ffe").drawRect(150, 150, 150, 150);
        }).wait(800).call(function() {
          blueShape.graphics.beginFill("#215477").drawRect(150, 150, 150, 150);
        });
      },
      sound: function() {
        blueSound.play();
      }
    }
  }

  //
  //WHEN USER WINS
  //

  function userWon() {
    display.val("YOU WON!");
    setTimeout(function() {
      display.val("Play again!");
    }, 2000);
    setTimeout(function() {
      startGame();
    }, 3000);
  }

  //
  //_____________HELPER FUNCTIONS BELOW______________
  //CHECK FOR SEQUENCE MATCH BETWEEN BOT AND PLAYER

  function isCacheMatch() {

    if (simon.botCache[simon.playerCache.length - 1] == simon.playerCache[simon.playerCache.length - 1]) {
      return true;
    } else
      return false;
  }

  //
  //______GENERATE RANDOM COLOR AND PLAY LIGHT AND SOUND_______
  //

  function generateRandomColor() {

    var randomColor = simon.colors[Math.round(Math.random() * 3)]; //choose random color and start the game
    switch (randomColor) {
      case "green":
        simon.green.light(), simon.green.sound(), simon.botCache.push(0);
        break;
      case "red":
        simon.red.light(), simon.red.sound(), simon.botCache.push(1);
        break;
      case "yellow":
        simon.yellow.light(), simon.yellow.sound(), simon.botCache.push(2);
        break;
      case "blue":
        simon.blue.light(), simon.blue.sound(), simon.botCache.push(3);
        break;
    }
  }

  //
  //_____________BOT TURN FUNCTIONALITY BELOW______________
  //

  function botTurn() {
    //alert("called")
    console.log(simon.botCache, simon.playerCache, simon.level);
    var length = simon.botCache.length;
    i = 0;
    simon.playerCache = [];

    interval = setInterval(function() {
      if (simon.botCache[i] == 0) {

        simon.green.light(), simon.green.sound();

      } else if (simon.botCache[i] == 1) {

        simon.red.light(), simon.red.sound();

      } else if (simon.botCache[i] == 2) {

        simon.yellow.light(), simon.yellow.sound();

      } else if (simon.botCache[i] == 3) {

        simon.blue.light(), simon.blue.sound();

      }
      i++;
      if (i >= length) {
        clearInterval(interval);
      }
    }, 1200);

    setTimeout(function() {
      generateRandomColor();
      simon.playerTurn = true;
    }, 1200 * (length + 1));

  }

  //
  //_____________CANVAS PAD'S PLAYER EVENTS AND HADLERS BELOW_____________
  //

  greenShape.on("click", function() {
    if (simon.playerTurn) {
      console.log(simon.botCache, simon.playerCache, simon.level);
      simon.playerCache.push(0);
      if (isCacheMatch()) {
        simon.green.light(), simon.green.sound();
        if (simon.playerCache.length == simon.botCache.length) {
          setTimeout(function() {
            display.val("Nice!");
          }, 800);
          setTimeout(function() {
            if (simon.level < 20) {
              simon.playerTurn = false;
              simon.level++;
              display.val("lvl - " + simon.level + " - " + simon.isStrict);
              botTurn();
            }
            else {
              userWon();
            }

          }, 1600);
        }

      } else {
        simon.errorSound();
        display.val("OOPS! try again");
        if (simon.isStrict == "strict") {
          setTimeout(function() {
            startGame();
          }, 800);
        } else if (simon.isStrict == "not strict") {
          simon.playerTurn = false;
          setTimeout(function() {
            display.val("OOPS! try again");
          }, 800);
          setTimeout(function() {
            display.val("lvl - " + simon.level + " - " + simon.isStrict);
            simon.botCache.pop();
            botTurn();
          }, 1600);

        }

      }
    }
  });

  redShape.on("click", function() {
    if (simon.playerTurn) {
      console.log(simon.botCache, simon.playerCache, simon.level);
      simon.playerCache.push(1);
      if (isCacheMatch()) {
        simon.red.light(), simon.red.sound();
        if (simon.playerCache.length == simon.botCache.length) {
          setTimeout(function() {
            display.val("Nice!");
          }, 800);
          setTimeout(function() {
            if (simon.level < 20) {
              simon.playerTurn = false;
              simon.level++;
              display.val("lvl - " + simon.level + " - " + simon.isStrict);
              botTurn();
            }
            else {
              userWon();
            }
          }, 1600);
        }
      } else {
        simon.errorSound();
        display.val("OOPS! try again");
        if (simon.isStrict == "strict") {
          setTimeout(function() {
            startGame();
          }, 800);
        } else if (simon.isStrict == "not strict") {
          simon.playerTurn = false;
          setTimeout(function() {
            display.val("OOPS! try again");
          }, 800);
          setTimeout(function() {
            display.val("lvl - " + simon.level + " - " + simon.isStrict);
            simon.botCache.pop();
            botTurn();
          }, 1600);
        }

      }
    }
  });

  yellowShape.on("click", function() {
    if (simon.playerTurn) {
      console.log(simon.botCache, simon.playerCache, simon.level);
      simon.playerCache.push(2);
      if (isCacheMatch()) {
        simon.yellow.light(), simon.yellow.sound();
        if (simon.playerCache.length == simon.botCache.length) {
          setTimeout(function() {
            display.val("Nice!");
          }, 800);
          setTimeout(function() {
            if (simon.level < 20) {
              simon.playerTurn = false;
              simon.level++;
              display.val("lvl - " + simon.level + " - " + simon.isStrict);
              botTurn();
            }
            else {
              userWon();
            }
          }, 1600);
        }
      } else {
        simon.errorSound();
        display.val("OOPS! try again");
        if (simon.isStrict == "strict") {
          setTimeout(function() {
            startGame();
          }, 800);
        } else if (simon.isStrict == "not strict") {
          simon.playerTurn = false;
          setTimeout(function() {
            display.val("OOPS! try again");
          }, 800);
          setTimeout(function() {
            display.val("lvl - " + simon.level + " - " + simon.isStrict);
            simon.botCache.pop();
            botTurn();
          }, 1600);
        }

      }
    }
  });

  blueShape.on("click", function() {
    if (simon.playerTurn) {
      console.log(simon.botCache, simon.playerCache, simon.level);
      simon.playerCache.push(3);
      if (isCacheMatch()) {
        simon.blue.light(), simon.blue.sound();
        if (simon.playerCache.length == simon.botCache.length) {
          setTimeout(function() {
            display.val("Nice!");
          }, 800);
          setTimeout(function() {
            if (simon.level < 20) {
              simon.playerTurn = false;
              simon.level++;
              display.val("lvl - " + simon.level + " - " + simon.isStrict);
              botTurn();
            }
            else {
              userWon();
            }
          }, 1600);

        }
      } else {
        simon.errorSound();
        display.val("OOPS! try again");
        if (simon.isStrict == "strict") {
          setTimeout(function() {
            startGame();
          }, 800);
        } else if (simon.isStrict == "not strict") {
          simon.playerTurn = false;
          setTimeout(function() {
            display.val("OOPS! try again");
          }, 800);
          setTimeout(function() {
            display.val("lvl - " + simon.level + " - " + simon.isStrict);
            simon.botCache.pop();
            botTurn();
          }, 1600);
        }
      }
    }
  });

  // ________ ALL BUTTONS BELOW _________
  //
  //On Off toggle button
  //
  display = $(".displayLevel");
  display.val("--- off ---");

  $(".toggle").on("click", function() {
    if (display.val() == "--- off ---") {
      display.val("Let's Play!");
      simon.colors.forEach(function(item) {
        simon[item].light();
      })

      setTimeout(function() {
        simon.isOn = true; //the game is truly on only after it's timeout for 1 second
      }, 1000)

    } else if (display.val() !== "--- off ---") {
      simon.isStrict = "not strict";
      display.val("--- off ---");
      simon.start = false;
      simon.isOn = false;
      simon.botCache = [];
      simon.playerCache = [];
      simon.level = 0;
      clearInterval(interval);
      i = 0;
    }
  })

  //
  //strict button
  //
  var strictButton = $(".strict");
  strictButton.on("click", function() {
    if (simon.isOn && simon.start) {
      if (simon.isStrict == "not strict") {
        simon.isStrict = "strict";
        display.val("lvl - " + simon.level + " - " + simon.isStrict); //display this pattern in all places
      } else if (simon.isStrict == "strict") {
        simon.isStrict = "not strict";
        display.val("lvl - " + simon.level + " - " + simon.isStrict);
      }
    }
  });

  //
  //start button
  //
  var startButton = $(".start");
  startButton.on("click", startGame);

  function startGame() { //first round of simon game
    if (simon.isOn) {
      clearInterval(interval);
      simon.start = true;
      simon.botCache = [];
      simon.playerCache = [];
      simon.level = 1;
      i = 0;

      setTimeout(function() {
        display.val("lvl - " + simon.level + " - " + simon.isStrict);
        generateRandomColor();
      }, 800); //end of setTimeout

      simon.playerTurn = true;

    } // end of if
  }

}); // end of document ready function
