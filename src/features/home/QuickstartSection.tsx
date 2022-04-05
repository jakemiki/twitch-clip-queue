import { Title, Text, Box } from "@mantine/core";

function QuickstartSection() {
  return (
    <Box mb="md">
      <Title order={2}>Quickstart</Title>
      <Text component="p">
        Simply <Text component="span" weight="bold">Login with Twitch</Text>. You'll be redirected to Twitch and
        asked to allow the application to get your username and read chat in your name. Any information received from Twitch is not
        sent anywhere but Twitch. By default you'll join your channel's chat, but you can change the channel afterwards.
        The only thing left to do is to <Text component="span" weight="bold">open the queue</Text> and wait for some clip links to be posted in chat.
      </Text>
    </Box>
  );
}

export default QuickstartSection;
