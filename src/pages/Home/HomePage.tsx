import React from 'react';
import Page from '../Page';
import TwitchAuth from '../../services/TwitchAuth';
import screenshot from './screenshot.png';
import './styles.css';

function HomePage() {
  return (
    <Page>
      <section className="mb-4">
        <p>Enqueue and play clips from your Twitch Chat using nothing more than your web browser</p>
      </section>
      <section className="mb-4 leading-relaxed">
        <h2>Quickstart</h2>
        <p className="items-baseline">
          Simply <a href={TwitchAuth.getLoginUrl()}>Login with Twitch</a>. You'll be redirected to Twitch and asked to
          allow the application to get your username and read chat. Any information received from Twitch is not sent
          anywhere but Twitch. By default you'll join your channel's chat, but you can change the channel afterwards.
          The only thing left to do is to open the clip floodgates and wait for some to be posted in chat.
        </p>
      </section>
      <section className="mb-4 leading-relaxed">
        <h2>Features</h2>
        <ul>
          <li>
            <strong>Supports Twitch clip, VOD and YouTube video links</strong>
          </li>
          <li>
            <strong>Integrates with Twitch chat</strong>
            <p>
              gathers links from messages to build the queue, by default from your chat but can join arbitrary channels
            </p>
          </li>
          <li>
            <strong>Deduplicates clips</strong>
            <p>
              prevents from adding the same clip to the queue multiple times, persists remembered clips between queues
            </p>
          </li>
          <li>
            <strong>Recognizes clip popularity</strong>
            <p>when the same clip is posted by multiple users it will be moved up in the queue</p>
          </li>
          <li>
            <strong>Offers basic queue management</strong>
            <p>
              allows playing clips out of order, removing clips from queue, clearing the queue and purging persistant
              clip memory
            </p>
          </li>
          <li>
            <strong>Handles deleted messages and timed out users</strong>
            <p>when a message with clip link is deleted from chat it is removed from the queue as well</p>
            <p>if a user that submitted clips is timed out their clips are removed from the queue (unless someone else submitted the as well)</p>
          </li>
          <li>
            <strong>Respects privacy</strong>
            <p>does not store any personal data, does not communicate with any third party services</p>
            <p>requires permission only to get your username and read chat</p>
          </li>
          <li>
            <strong><span className="text-purple-400">NEW</span> Allows mods to control the queue using chat commands</strong>
            <p>
              <code>!queuenext</code> - next clip<br />
              <code>!queueopen</code> - opens the queue to accept submissions<br />
              <code>!queueclose</code> - closes the queue for new submissions<br />
              <code>!queueclear</code> - clears the queue<br />
              <code>!queuepurgememory</code> - purges the permanent clip memory
            </p>
          </li>
        </ul>
      </section>
      <section>
        <h2>Screenshot</h2>
        <a href={screenshot} target="_blank" rel="noreferrer" className="block mx-auto screenshot border-gray-200">
          <img src={screenshot} alt="Screenshot" />
        </a>
      </section>
    </Page>
  );
}

export default HomePage;
