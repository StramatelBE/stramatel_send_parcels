import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import Container from '../../../components/ContainerComponents';
import { useTranslation } from 'react-i18next';

function PreviewComponents() {
  const { t } = useTranslation();

  return (
    <Container icon={Icon()} title={t('preview.title')} content={Preview()} />
  );
}

function Icon() {
  return <VideoLabelIcon sx={{ color: 'primary.light' }} />;
}

function Preview() {
  return (
    <>
      <iframe
        src={process.env.PREVIEW_URL}
        title="Preview"
        style={{
          border: 'none',
          height: `${process.env.PREVIEW_HEIGHT}px`,
          width: `${process.env.PREVIEW_WIDTH}px`,
        }}
      ></iframe>
    </>
  );
}

export default PreviewComponents;
