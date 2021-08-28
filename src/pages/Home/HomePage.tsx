import React from 'react';
import TwitchAuth from '../../services/TwitchAuth';

function HomePage() {
  return (
    <>
      <section className="mb-4">
        <p>
          Some info
        </p>
      </section>
      <section>
        <button onClick={() => TwitchAuth.redirectToLogin()}>Login with Twitch</button>
      </section>
    </>
  );
}

export default HomePage;
