import { useState, useEffect } from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import { Patterns } from "../helpers/winningPatterns";
import Square from "./Square";

function Board({ result, setResult }) {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [player, setPlayer] = useState("X");
  const [turn, setTurn] = useState("X");

  const { channel } = useChannelStateContext();
  const { client } = useChatContext();

  useEffect(() => {
    checkIfTie();
    checkWin();
  }, [board]);

  const chooseSquare = async (square) => {
    if (turn === player && board[square] === "") {
      setTurn(player === "X" ? "O" : "X");

      await channel.sendEvent({
        type: "game-move",
        data: { square, player },
      });

      setBoard(
        board.map((value, idx) => {
          if (idx === square && value === "") {
            return player;
          }
          return value;
        })
      );
    }
  };

  channel.on((event) => {
    if (event.type === "game-move" && event.user.id !== client.userID) {
      const currentPlayer = event.data.player === "X" ? "O" : "X";
      setPlayer(currentPlayer);
      setTurn(currentPlayer);

      setBoard(
        board.map((value, idx) => {
          if (idx === event.data.square && value === "") {
            return event.data.player;
          }
          return value;
        })
      );
    }
  });

  const checkWin = () => {
    Patterns.forEach((currPattern) => {
      const firstPlayer = board[currPattern[0]];
      if (firstPlayer === "") return;

      let foundWinningPattern = true;

      currPattern.forEach((idx) => {
        if (board[idx] !== firstPlayer) {
          foundWinningPattern = false;
        }
      });

      if (foundWinningPattern) {
        setResult({ winner: board[currPattern[0]], state: "won" });
      }
    });
  };

  const checkIfTie = () => {
    let filled = true;
    board.forEach((square) => {
      if (square === "") {
        filled = false;
      }
    });

    if (filled) {
      setResult({ winner: "none", state: "tie" });
    }
  };

  return (
    <div className="board">
      <div className="row">
        <Square chooseSquare={() => chooseSquare(0)} value={board[0]} />
        <Square chooseSquare={() => chooseSquare(1)} value={board[1]} />
        <Square chooseSquare={() => chooseSquare(2)} value={board[2]} />
      </div>
      <div className="row">
        <Square chooseSquare={() => chooseSquare(3)} value={board[3]} />
        <Square chooseSquare={() => chooseSquare(4)} value={board[4]} />
        <Square chooseSquare={() => chooseSquare(5)} value={board[5]} />
      </div>
      <div className="row">
        <Square chooseSquare={() => chooseSquare(6)} value={board[6]} />
        <Square chooseSquare={() => chooseSquare(7)} value={board[7]} />
        <Square chooseSquare={() => chooseSquare(8)} value={board[8]} />
      </div>
    </div>
  );
}

export default Board;
