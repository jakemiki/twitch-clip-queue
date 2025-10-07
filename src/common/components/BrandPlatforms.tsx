import React from 'react';
import { IconBrandTwitch, IconBrandKick, IconBrandYoutube } from '@tabler/icons-react';
import type { PlatformType } from '../utils';

interface BrandPlatformsProps {
  platform: PlatformType;
}

const Platform: React.FC<BrandPlatformsProps> = ({ platform }) => {
  switch (platform) {
    case 'Twitch':
      return <IconBrandTwitch size={15} />;
    case 'Kick':
      return <IconBrandKick size={15} />;
    case 'YouTube':
      return <IconBrandYoutube size={15} />;
    case 'Afreeca':
      return null;
    case 'Streamable':
      return null;
    case 'Sora':
      return null;
    default:
      return null;
  }
};

export default Platform;
