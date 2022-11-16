const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { StreamChat } = require("stream-chat");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const { API_KEY, SECRET_KEY, PORT = 3001 } = process.env;

const serverClient = StreamChat.getInstance(API_KEY, SECRET_KEY);

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, userName, password } = req.body;
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = serverClient.createToken(userId);
    res.json({ token, userId, firstName, lastName, userName, hashedPassword });
  } catch (error) {
    res.json(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;
    const { users } = await serverClient.queryUsers({ name: userName });

    if (users.length === 0) return res.json({ message: "User not found" });

    const token = serverClient.createToken(users[0].id);
    const passwordMatch = await bcrypt.compare(
      password,
      users[0].hashedPassword
    );

    if (passwordMatch) {
      res.json({
        token,
        firstName: users[0].firstName,
        lastName: users[0].lastName,
        userName,
        userId: users[0].id,
      });
    }
  } catch (error) {
    res.json(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
