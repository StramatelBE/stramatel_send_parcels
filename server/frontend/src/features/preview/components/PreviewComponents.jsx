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
  const height = import.meta.env.VITE_PREVIEW_HEIGHT;
  const width = import.meta.env.VITE_PREVIEW_WIDTH;
  const ratio = height / width;

  return (<><iframe
    src={import.meta.env.VITE_PREVIEW_URL}
    title="Preview"
    style={{
      border: "none",
      height: `calc(80vh * ${ratio})`,
      width: `calc(80vw * ${ratio})`,

    }}
  ></iframe></>
    
  );
}

export default PreviewComponents
