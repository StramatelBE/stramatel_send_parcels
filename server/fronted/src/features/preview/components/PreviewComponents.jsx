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

function Preview(){
  return ( 
  <iframe src={import.meta.env.VITE_REACT_APP_PREVIEW_URL}
    title="Preview"
    style={{ border: "none", minHeight: `${import.meta.env.VITE_REACT_APP_PREVIEW_HEIGHT}px`, minWidth: `${import.meta.env.VITE_REACT_APP_PREVIEW_WIDTH}px` }}
  ></iframe>)
}

export default PreviewComponents
