import { useState } from '@hookstate/core';
import Button from '../components/Button';
import { GitHubLogo, TwitchLogo } from '../components/Logos';
import TwitchAuth from '../services/TwitchAuth';
import { isLoggedIn, logOut } from '../store/user';

function Header() {
  const loggedIn = useState(isLoggedIn);

  return (
    <header className="flex mb-4 px-16 py-2 bg-gray-800">
      <h1>Twitch Clip Queue</h1>
      {loggedIn.get() && (
        <div className="ml-8 pb-1 flex text-sm items-end">
          by
          <GitHubLogo className="ml-2 mr-1" size={16} href="https://github.com/JakeMiki">
            JakeMiki
          </GitHubLogo>
          /
          <TwitchLogo className="ml-1" size={16} href="https://twitch.tv/SirMuffin9">
            SirMuffin9
          </TwitchLogo>
        </div>
      )}
      <div className="flex-grow"></div>
      <div>
        {loggedIn.get() ? (
          <Button onClick={async () => await logOut()}>Logout</Button>
        ) : (
          <Button onClick={() => TwitchAuth.redirectToLogin()}>Login with Twitch</Button>
        )}
      </div>
    </header>
  );
}

export default Header;
