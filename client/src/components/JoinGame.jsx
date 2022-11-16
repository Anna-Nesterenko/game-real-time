import { useState } from "react";
import { useChatContext, Channel } from "stream-chat-react";
import CustomInput from "./CustomInput";
import Game from "./Game";

function JoinGame({ fetchLogOut }) {
  const [opponentName, setOpponentName] = useState("");
  const [channel, setChannel] = useState(null);

  const { client } = useChatContext();

  const createChannel = async () => {
    const response = await client.queryUsers({ name: { $eq: opponentName } });
    if (response.users.length === 0) {
      alert("user not found");
      return;
    }
    const newChannel = await client.channel("messaging", {
      members: [client.userID, response.users[0].id],
    });
    await newChannel.watch();
    setChannel(newChannel);
  };

  return (
    <>
      {channel ? (
        <Channel channel={channel} Input={CustomInput}>
          <Game channel={channel} setChannel={setChannel} />
        </Channel>
      ) : (
        <div className="join-game">
          <h4>Create New Game</h4>
          <input
            placeholder="The opponent's user name"
            onChange={(event) => {
              setOpponentName(event.target.value);
            }}
          />
          <button onClick={createChannel}>Join/Start Game</button>
          <button onClick={fetchLogOut}>Log Out</button>
        </div>
      )}
    </>
  );
}

export default JoinGame;
