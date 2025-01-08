import PollIcon from '@mui/icons-material/Poll';
import { Skeleton } from '@mui/material';
import Container from '../../../components/ContainerComponents';
import useLoadingStore from '../../../stores/loadingStore';
import EditorComponents from './EditorComponents';
function DataComponents() {
  const { isLoading } = useLoadingStore();
  return (
    <Container
      icon={Icon()}
      title="Data"
      content={
        isLoading ? (
          <>
            {[...Array(3)].map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                style={{
                  height: '50px',
                  width: '95%',
                  marginLeft: '2.5%',
                  marginRight: '2.5%',
                  marginBottom: index === 2 ? '0' : '10px',
                  borderRadius: '10px',
                }}
              />
            ))}
          </>
        ) : (
          <Data />
        )
      }
    />
  );
}

function Icon() {
  return <PollIcon sx={{ color: 'primary.light' }} />;
}

function Data() {
 

  return (
    <>
      <EditorComponents />
    </>
  );
}

export default DataComponents;
