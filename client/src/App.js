import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

function App() {
  const signUpUser = async () => {
    await axios.post(
      "http://auth-srv/api/users",
      JSON.stringify({
        email: "testuser@gmail.com",
        firstName: "Test",
        lastName: "User",
        password: "123456789",
      })
    );
  };

  return (
    <div className="App">
      <button onClick={signUpUser}>Sign Up</button>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
