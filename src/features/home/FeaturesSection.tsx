import { Title, List, ThemeIcon, Code, Box } from "@mantine/core";
import { CircleCheck } from 'tabler-icons-react';

function FeaturesSection() {
  return (
    <Box mb="md">
      <Title order={2}>Features</Title>
      <List
        mt="md"
        spacing="sm"
        icon={
          <ThemeIcon size={26} radius="xl">
            <CircleCheck size={18} />
          </ThemeIcon>
        }
      >
        <List.Item>
          <strong>Supports Twitch clip, Twitch VOD, YouTube and Streamable video links</strong>
        </List.Item>
        <List.Item>
          <strong>Integrates with Twitch chat</strong>
          <br />
          gathers links from messages to build the queue, by default from your chat but can join arbitrary channels
        </List.Item>
        <List.Item>
          <strong>Deduplicates clips</strong>
          <br />
          prevents from adding the same clip to the queue multiple times, persists remembered clips between queues
        </List.Item>
        <List.Item>
          <strong>Recognizes clip popularity</strong>
          <br />
          when the same clip is posted by multiple users it will be moved up in the queue
        </List.Item>
        <List.Item>
          <strong>Offers basic queue management</strong>
          <br />
          allows playing clips out of order, removing clips from queue, clearing the queue and purging persistant clip
          memory
        </List.Item>
        <List.Item>
          <strong>Handles deleted messages and timed out users</strong>
          <br />
          when a message with clip link is deleted from chat it is removed from the queue as well
          <br />
          if a user that submitted clips is timed out their clips are removed from the queue (unless someone else
          submitted the clip as well)
        </List.Item>
        <List.Item>
          <strong>Respects privacy</strong>
          <br />
          does not store any personal data, does not communicate with any third party services
          <br />
          requires permission only to get your username and read chat
        </List.Item>
        <List.Item>
          <strong>Allows channel moderators to control the queue using chat commands</strong>
          <br />
          prefixed with <Code>!queue</Code> by default (ex. <Code>!queuenext</Code>)
          <br />
          <Code>next</Code> - next clip
          <br />
          <Code>open</Code> - opens the queue to accept submissions
          <br />
          <Code>close</Code> - closes the queue for new submissions
          <br />
          <Code>clear</Code> - clears the queue
          <br />
          <Code>purgememory</Code> - purges the permanent clip memory
          <br />
          <Code>autoplay [on/off]</Code> - switches autoplay on/off
          <br />
          <Code>limit [number]</Code> - sets clip limit to [number]
          <br />
          <Code>remove [url]</Code> - removes the clip with [url] from the queue
          <br />
          <Code>providers [providers]</Code> - sets enabled clip providers to [providers]
        </List.Item>
      </List>
    </Box>
  );
}

export default FeaturesSection;
