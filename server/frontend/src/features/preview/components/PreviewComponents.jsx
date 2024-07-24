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

  return (
    <>
        <iframe
          src={process.env.PREVIEW_URL}
          title="Preview"
          style={{
            border: "none",
            height: `${process.env.PREVIEW_HEIGHT}px`,
            width: `${process.env.PREVIEW_WIDTH}px`,
          }}
        ></iframe>
    </>
  );
}

export default PreviewComponents
