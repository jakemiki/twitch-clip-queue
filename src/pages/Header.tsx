import { useState } from "@hookstate/core";
import Button from "../components/Button";
import TwitchAuth from "../services/TwitchAuth";
import { isLoggedIn, logOut } from "../store/user";

function Header() {
  const loggedIn = useState(isLoggedIn);

  return (
    <header className="flex mb-4 pl-16 pr-32 pt-2 pb-2 bg-gray-800">
      <h1>Twitch Clip Queue</h1>
      <div className="flex-grow"></div>
      <div>
        {loggedIn.get() ? (
          <Button onClick={async () => await logOut()}>Logout</Button>
        ) : (
          <Button
            onClick={() => TwitchAuth.redirectToLogin()}
          >
            Login with Twitch
          </Button>
        )}
      </div>
    </header>
  );
}

export default Header;
