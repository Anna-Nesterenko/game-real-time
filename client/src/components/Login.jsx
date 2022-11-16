import { useState } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";

function Login({ setIsAuth }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const cookies = new Cookies();

  const fetchLogin = () => {
    Axios.post("http://localhost:3001/login", {
      userName,
      password,
    }).then((res) => {
      const { firstName, lastName, userName, token, userId } = res.data;
      cookies.set("token", token);
      cookies.set("userId", userId);
      cookies.set("userName", userName);
      cookies.set("firstName", firstName);
      cookies.set("lastName", lastName);
      setIsAuth(true);
    });
  };
  return (
    <div className="login">
      <label> Login</label>

      <input
        placeholder="Username"
        onChange={(event) => {
          setUserName(event.target.value);
        }}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
      <button onClick={fetchLogin}> Login</button>
    </div>
  );
}

export default Login;
