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
  const height = process.env.PREVIEW_HEIGHT;
  const width = process.env.PREVIEW_WIDTH;
  const ratio = (height / width) * 100;
  const padding = "20px"; 

  return (
    <>
      <div style={{ position: "relative", width: `calc(100% - ${padding} * 2)`, paddingTop: `calc(${ratio}% )`, }}>
        <iframe
          src={process.env.PREVIEW_URL}
          title="Preview"
          style={{
            position: "absolute",
            top: padding,
            left: padding,
            border: "none",
            height: `calc(100% - ${padding} * 2)`,
            width: `calc(100% - ${padding} * 2)`,
          }}
        ></iframe>
      </div>
    </>
  );
}

export default PreviewComponents
