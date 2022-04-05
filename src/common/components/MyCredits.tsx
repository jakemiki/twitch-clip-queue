import { Group, Text } from '@mantine/core';
import { BrandTwitch, BrandGithub } from 'tabler-icons-react';
import BrandButton from './BrandButton';

function MyCredits() {
  return (
    <Text color="dimmed" size="xs" weight={400}>
      <Group spacing={1}>
        <div>by</div>
        <BrandButton href="https://github.com/JakeMiki" icon={<BrandGithub size={16} />}>
          JakeMiki
        </BrandButton>
        <div>/</div>
        <BrandButton href="https://www.twitch.tv/SirMuffin9" icon={<BrandTwitch size={16} />}>
          SirMuffin9
        </BrandButton>
      </Group>
    </Text>
  );
}

export default MyCredits;
