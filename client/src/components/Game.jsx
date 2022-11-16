import { useState } from "react";
import Board from "./Board";
import { Window, MessageList, MessageInput } from "stream-chat-react";
import "./Chat.css";

function Game({ channel, setChannel }) {
  const [result, setResult] = useState({ winner: "none", state: "none" });
  const [playersJoined, setPlayersJoined] = useState(
    channel.state.watcher_count === 2
  );

  channel.on("user.watching.start", (event) => {
    setPlayersJoined(event.watcher_count === 2);
  });

  if (!playersJoined) {
    return <div> Waiting for other player to join...</div>;
  }

  return (
    <div className="wrapper">
      <div className="container">
        <Board result={result} setResult={setResult} />
        <Window>
          <MessageList
            disableDateSeparator
            // closeReactionSelectorOnClick
            hideDeletedMessages
            messageActions={["react"]}
          />
          <MessageInput noFiles />
        </Window>
      </div>
      <div className="wrapper-result">
        <button
          onClick={async () => {
            await channel.stopWatching();
            setChannel(null);
          }}
        >
          Leave Game
        </button>
        {result.state === "won" && (
          <div> Player "{result.winner}" Won The Game</div>
        )}
        {result.state === "tie" && <div> Game Tied</div>}
      </div>
    </div>
  );
}

export default Game;
