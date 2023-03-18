const crypto = require("crypto");
const readline = require("readline");
const chalk = require("chalk");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const Table = require("cli-table");

class Hmac {
  constructor(move) {
    this.move = move;
  }
  getHmacKey() {
    const key = crypto.randomBytes(32).toString("hex");
    return key;
  }
  getHmac(move, key) {
    const hmac = crypto.createHmac("sha256", key);
    hmac.update(move);
    return hmac.digest("hex");
  }
}

class Game {
  constructor(moves) {
    this.moves = moves;
  }

  getComputerMove() {
    const randomIndex = Math.floor(Math.random() * this.moves.length);
    return this.moves[randomIndex];
  }
  getMoveResult(userMove, computerMove) {
    const half = this.moves.length / 2;
    const userMoveIndex = this.moves.indexOf(userMove);
    const computerMoveIndex = this.moves.indexOf(computerMove);

    if (userMoveIndex === computerMoveIndex) {
      return chalk.yellow("Draw");
    } else if (
      (userMoveIndex < computerMoveIndex &&
        computerMoveIndex - userMoveIndex < half) ||
      (userMoveIndex > computerMoveIndex &&
        userMoveIndex - computerMoveIndex > half)
    ) {
      return chalk.red("Computer win");
    } else {
      return chalk.green("You win");
    }
  }

  start() {
    if (
      moves.length < 3 ||
      moves.length % 2 === 0 ||
      new Set(moves).size !== moves.length
    ) {
      console.log(
        'Incorrect input. Example: "node index.js rock paper scissors"'
      );
      rl.close();
    } else {
      const computerMove = this.getComputerMove();
      const hmac = new Hmac();
      const hmacKey = hmac.getHmacKey();
      console.log(`HMAC: ${hmac.getHmac(computerMove, hmacKey)}`);
      console.log(`Available moves:`);

      this.moves.forEach((move, i) => {
        console.log(`${i + 1} - ${move}`);
      });
      console.log("0 - Exit");
      console.log("? - help");

      rl.question("Enter your move: ", (userMoveIndex) => {
        if (userMoveIndex === "0") {
          console.log("Goodbye!");
          rl.close();
          return;
        }
        if (userMoveIndex === "?") {
          const table = new Table({
            head: [
              "User/Comp ⬇",
              "Rock",
              "Paper",
              "Scissors",
              "Lizard",
              "Spock",
            ],
          });
          table.push(
            { Rock: ["Draw", "Lose", "Win", "Win", "Lose"] },
            { Paper: ["Win", "Draw", "Lose", "Lose", "Win"] },
            { Scissors: ["Lose", "Win", "Draw", "Win", "Lose"] },
            { Lizard: ["Lose", "Win", "Lose", "Draw", "Win"] },
            { Spock: ["Win", "Lose", "Win", "Lose", "Draw"] }
          );
          console.log(table.toString());
          return this.start();
        }

        const userMove = this.moves[userMoveIndex - 1];
        if (!userMove) {
          console.log(chalk.red("\nError userMove Restart\n"));
          return this.start();
        }
        const result = this.getMoveResult(userMove, computerMove);

        console.log(chalk.green(`Your move: ${userMove}`));
        console.log(chalk.red(`Computer move: ${computerMove}`));
        console.log(`HMAC key: ${hmacKey}`);
        console.log(result + "\n");

        return this.start();
      });
    }
  }
}

const moves = process.argv.slice(2);
const game = new Game(moves);
game.start();
