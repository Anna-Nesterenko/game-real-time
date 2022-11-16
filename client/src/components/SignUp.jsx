import { useState } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";

function SignUp({ setIsAuth }) {
  const cookies = new Cookies();
  const [user, setUser] = useState(null);

  const fetchsSignUp = () => {
    Axios.post("http://localhost:3001/signup", user).then((res) => {
      const { token, userId, firstName, lastName, userName, hashedPassword } =
        res.data;
      cookies.set("token", token);
      cookies.set("userId", userId);
      cookies.set("userName", userName);
      cookies.set("firstName", firstName);
      cookies.set("lastName", lastName);
      cookies.set("hashedPassword", hashedPassword);
      setIsAuth(true);
    });
  };
  return (
    <div className="signUp">
      <label> Sign Up</label>
      <input
        placeholder="First Name"
        onChange={(event) => {
          setUser({ ...user, firstName: event.target.value });
        }}
      />
      <input
        placeholder="Last Name"
        onChange={(event) => {
          setUser({ ...user, lastName: event.target.value });
        }}
      />
      <input
        placeholder="User Name"
        onChange={(event) => {
          setUser({ ...user, userName: event.target.value });
        }}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(event) => {
          setUser({ ...user, password: event.target.value });
        }}
      />
      <button onClick={fetchsSignUp}> Sign Up</button>
    </div>
  );
}

export default SignUp;
