import { useAppSelector } from '../../../app/hooks';
import { selectLayout } from '../clipQueueSlice';
import ClassicLayout from './layouts/ClassicLayout';
import FullscreenWithPopupLayout from './layouts/FullscreenWithPopupLayout';
import SpotlightLayout from './layouts/SpotlightLayout';

function QueuePage() {
  const layout = useAppSelector(selectLayout);

  switch (layout) {
    case 'classic':
      return <ClassicLayout />;
    case 'spotlight':
      return <SpotlightLayout />;
    case 'fullscreen':
      return <FullscreenWithPopupLayout />;
    default:
      return <ClassicLayout />;
  }
}

export default QueuePage;
