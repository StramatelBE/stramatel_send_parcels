import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import Container from '../../../components/ContainerComponents';

function PreviewComponents() {
  return (
    <Container icon={Icon()} title="Preview" content={Preview()} />
  )
}

function Icon() {
  return   <VideoLabelIcon sx={{ color: "primary.light" }} />
}

function Preview() {
  const height = import.meta.env.VITE_REACT_APP_PREVIEW_HEIGHT;
  const width = import.meta.env.VITE_REACT_APP_PREVIEW_WIDTH;
  const ratio = height / width;

  return (
    <iframe
      src={import.meta.env.VITE_REACT_APP_PREVIEW_URL}
      title="Preview"
      style={{
        border: "none",
        width: "100%",
        height: `calc(100vw * ${ratio})`,
        maxHeight: "100vh"
      }}
    ></iframe>
  );
}

export default PreviewComponents
