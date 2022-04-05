import { Menu, Badge, NumberInput, Button, Stack } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { FormEvent, useState } from 'react';
import { TrashX, Tallymarks } from 'tabler-icons-react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { settingsChanged } from '../../settings/settingsSlice';
import { queueCleared, selectClipLimit } from '../clipQueueSlice';

function ClipLimitModal({ onSubmit }: { onSubmit: () => void }) {
  const dispatch = useAppDispatch();
  const clipLimit = useAppSelector(selectClipLimit);
  const [value, setValue] = useState(clipLimit);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    dispatch(settingsChanged({ clipLimit: value || null }));
    onSubmit();

    event.preventDefault();
  };

  return (
    <form onSubmit={submit}>
      <Stack>
        <NumberInput
          placeholder="Clip limit"
          description={
            <>
              Max number of clips in the queue. Afterwards new clips will not be accepted, current clips can be boosted
              to the top of the queue. You can <em>Skip</em> a clip instead of <em>Next</em>-ing it to free a spot.
              <br />
              Leave empty or 0 to disable.
            </>
          }
          min={0}
          step={1}
          value={value ?? undefined}
          onChange={(val) => setValue(val)}
        />
        <Button type="submit">Save</Button>
      </Stack>
    </form>
  );
}

function QueueQuickMenu() {
  const modals = useModals();
  const dispatch = useAppDispatch();
  const clipLimit = useAppSelector(selectClipLimit);

  const openClipLimitModal = () => {
    const id = modals.openModal({
      title: 'Set clip limit',
      children: <ClipLimitModal onSubmit={() => modals.closeModal(id)} />,
    });
  };

  return (
    <>
      <Menu>
        <Menu.Item
          icon={<Tallymarks size={14} />}
          rightSection={<Badge color="indigo">{clipLimit ?? 'off'}</Badge>}
          onClick={() => openClipLimitModal()}
        >
          Set queue limit
        </Menu.Item>
        <Menu.Item icon={<TrashX size={14} />} color="red" onClick={() => dispatch(queueCleared())}>
          Clear queue
        </Menu.Item>
      </Menu>
    </>
  );
}

export default QueueQuickMenu;
