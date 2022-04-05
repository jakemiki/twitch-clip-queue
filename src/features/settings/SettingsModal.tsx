import { Button, Chip, Chips, Group, Stack, TextInput, Text, NumberInput, Tabs, Select, Code } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { History, Settings, Slideshow } from 'tabler-icons-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  memoryPurged,
  selectHistoryIds,
  selectClipLimit,
  selectLayout,
  selectProviders,
} from '../clips/clipQueueSlice';
import { selectChannel, selectCommandPrefix, settingsChanged } from './settingsSlice';

function SettingsModal({ closeModal }: { closeModal: () => void }) {
  const dispatch = useAppDispatch();
  const channel = useAppSelector(selectChannel);
  const commandPrefix = useAppSelector(selectCommandPrefix);
  const clipLimit = useAppSelector(selectClipLimit);
  const enabledProviders = useAppSelector(selectProviders);
  const layout = useAppSelector(selectLayout);
  const historyIds = useAppSelector(selectHistoryIds);

  const form = useForm({
    initialValues: { channel, commandPrefix, clipLimit, enabledProviders, layout },
  });

  return (
    <form
      onSubmit={form.onSubmit((settings) => {
        dispatch(settingsChanged(settings));
        closeModal();
      })}
    >
      <Stack spacing="md">
        <Tabs>
          <Tabs.Tab label="General" icon={<Settings size={16} />}>
            <Stack>
              <TextInput
                label="Twitch channel"
                description="Twitch chat channel to join"
                required
                {...form.getInputProps('channel')}
              />
              <Stack spacing={4}>
                <TextInput
                  label="Command prefix"
                  description="Prefix for chat commands, which can be used by moderators"
                  required
                  {...form.getInputProps('commandPrefix')}
                />
                <Text size="xs" color="gray">
                  Example commands: <Code>{form.values.commandPrefix}open</Code>,{' '}
                  <Code>{form.values.commandPrefix}next</Code>
                </Text>
              </Stack>
            </Stack>
          </Tabs.Tab>

          <Tabs.Tab label="Clip queue" icon={<Slideshow size={16} />}>
            <Stack>
              <Select
                required
                label="Queue layout"
                data={[
                  { value: 'classic', label: 'Classic' },
                  { value: 'spotlight', label: 'Spotlight' },
                  { value: 'fullscreen', label: 'Fullscreen with popup (experimental)' },
                ]}
                {...form.getInputProps('layout')}
              />
              <Stack spacing="sm">
                <Text size="sm">Clip providers</Text>
                <Chips multiple {...form.getInputProps('enabledProviders')}>
                  <Chip value="twitch-clip">Twitch Clips</Chip>
                  <Chip value="twitch-vod">Twitch Videos / VODs</Chip>
                  <Chip value="youtube">YouTube</Chip>
                  <Chip value="streamable">Streamable</Chip>
                </Chips>
              </Stack>
              <NumberInput
                label="Clip limit"
                description={
                  <>
                    Max number of clips in the queue. Afterwards new clips will not be accepted, current clips can be
                    boosted to the top of the queue. You can <em>Skip</em> a clip instead of <em>Next</em>-ing it to
                    free a spot.
                    <br />
                    Leave empty or 0 to disable.
                  </>
                }
                min={0}
                step={1}
                value={form.values.clipLimit ?? undefined}
                onChange={(event) => form.setFieldValue('clipLimit', event ?? null)}
              />
            </Stack>
          </Tabs.Tab>

          <Tabs.Tab label="Clip memory" icon={<History size={16} />}>
            <Stack>
              <Text size="sm">
                Here, soon, you'll be able to setup for how long watched clips should be remembered before they can be
                added to the queue again. As well as change other clip memory related settings.
              </Text>
              <Group>
                <Text size="sm">You have {historyIds.length} clips in permanent memory</Text>
                <Button color="red" size="xs" onClick={() => dispatch(memoryPurged())}>
                  Purge memory
                </Button>
              </Group>
            </Stack>
          </Tabs.Tab>
        </Tabs>
        <Group position="right" mt="md">
          <Button onClick={() => closeModal()} variant="outline">
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </Group>
      </Stack>
    </form>
  );
}

const useSettingsModal = () => {
  const modals = useModals();
  const openSettingsModal = () => {
    const id = modals.openModal({
      title: 'Settings',
      children: <SettingsModal closeModal={() => modals.closeModal(id)} />,
      closeOnClickOutside: false,
      closeOnEscape: false,
      size: 'lg',
    });
  };

  return { openSettingsModal };
};

export default useSettingsModal;
