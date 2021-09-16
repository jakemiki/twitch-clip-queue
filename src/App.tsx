import React from 'react';
import ForkMeOnGithub from './components/ForkMeOnGithub';
import Routes from './pages/Routes';


function App() {
  return (
    <>
      <ForkMeOnGithub href="https://github.com/JakeMiki/twitch-clip-queue" />
      <Routes />
    </>
  );
}

export default App;
