import { PropsWithChildren } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import Clip from '../Clip';
import { selectQueueIds, currentClipReplaced, queueClipRemoved } from '../clipQueueSlice';

interface QueueProps {
  card?: boolean;
  wrapper?: (props: PropsWithChildren<{}>) => JSX.Element;
}

function Queue({ wrapper, card }: QueueProps) {
  const dispatch = useAppDispatch();
  const clipQueueIds = useAppSelector(selectQueueIds);
  const Wrapper = wrapper ?? (({ children }) => <>{children}</>);

  return (
    <>
      {clipQueueIds.map((id) => (
        <Wrapper key={id}>
          <Clip
            key={id}
            clipId={id}
            card={card}
            onClick={() => dispatch(currentClipReplaced(id))}
            onCrossClick={() => dispatch(queueClipRemoved(id))}
          />
        </Wrapper>
      ))}
    </>
  );
}

export default Queue;
