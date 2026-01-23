import { PropsWithChildren } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectQueueIds, currentClipReplaced, queueClipRemoved, selectClipById } from '../clipQueueSlice';
import Clip from '../Clip';

interface QueueProps {
  card?: boolean;
  wrapper?: (props: PropsWithChildren<{}>) => JSX.Element;
}

function Queue({ wrapper, card }: QueueProps) {
  const dispatch = useAppDispatch();
  const clipQueueIds = useAppSelector(selectQueueIds);
  const Wrapper = wrapper ?? (({ children }) => <>{children}</>);
  const clips = useAppSelector((state) =>
    clipQueueIds.map((id) => selectClipById(id)(state)).filter((clip) => clip !== undefined)
  );

  return (
    <>
      {clips.map((clip) => (
        <Wrapper key={clip!.id}>
          <Clip
            platform={clip!.Platform || 'Unknown'}
            key={clip!.id}
            clipId={clip!.id}
            card={card}
            onClick={() => dispatch(currentClipReplaced(clip!.id))}
            onCrossClick={() => dispatch(queueClipRemoved(clip!.id))}
          />
        </Wrapper>
      ))}
    </>
  );
}

export default Queue;
