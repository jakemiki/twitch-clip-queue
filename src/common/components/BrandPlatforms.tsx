import React from 'react';
import {
  IconBrandTwitch,
  IconBrandKick,
  IconBrandYoutube,
  IconLetterA,
  IconPlayerPlayFilled,
} from '@tabler/icons-react';
import type { PlatformType } from '../utils';
import { Tooltip, Box } from '@mantine/core';
import { useAppSelector } from '../../app/hooks';
import { selectPlatformIconMode } from '../../features/settings/settingsSlice';

interface BrandPlatformsProps {
  platform: PlatformType;
  size?: number;
}

interface PlatformConfig {
  icon?: React.ElementType;
  color: string;
  label: string;
}

// Configuration for each platform type.
const platformConfig: Record<PlatformType, PlatformConfig> = {
  Twitch: { icon: IconBrandTwitch, color: '#9146FF', label: 'Twitch' },
  Kick: { icon: IconBrandKick, color: '#53FC18', label: 'Kick' },
  YouTube: { icon: IconBrandYoutube, color: '#FF0000', label: 'YouTube' },
  Afreeca: { icon: IconLetterA, color: '#0066FF', label: 'Afreeca TV' },
  Streamable: { icon: IconPlayerPlayFilled, color: '#1DA1F2', label: 'Streamable' },
  Unknown: { color: '#888888', label: 'Unknown Platform' },
};

const Platform: React.FC<BrandPlatformsProps> = ({ platform: Platform, size = 15 }) => {
  const config = platformConfig[Platform];
  const isUnknown = platformConfig.Unknown === config;
  const platformIconMode = useAppSelector(selectPlatformIconMode);

  if (!config || platformIconMode === 'disabled') return null;

  const IconComponent = config.icon;
  const Mode = platformIconMode === 'grayscale' ? platformConfig.Unknown.color : config.color;

  return (
    <Tooltip
      label={config.label}
      position="top"
      disabled={isUnknown}
      styles={{
        body: {
          backgroundColor: Mode,
          color: '#fff',
          fontWeight: 500,
        },
        arrow: { backgroundColor: Mode },
      }}
      withArrow
    >
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          verticalAlign: 'middle',
          transform: 'translateY(-1px)',
        }}
      >
        {IconComponent && <IconComponent size={size} color={Mode} />}
      </Box>
    </Tooltip>
  );
};

export default Platform;
