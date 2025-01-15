import EditIcon from '@mui/icons-material/Edit';
import { Skeleton } from '@mui/material';
import Container from '../../../components/ContainerComponents';
import useLoadingStore from '../../../stores/loadingStore';
import EditorComponents from './EditorComponents';
import dataStore from '../stores/dataStore';
function DataComponents() {
  const { isLoading } = useLoadingStore();
  return (
    <Container
      icon={Icon()}
      title="Text editor"
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
  return <EditIcon sx={{ color: 'primary.light' }} />;
}

function Data() {
  const { data } = dataStore();

  return (
    <>
      <EditorComponents data={data} />
    </>
  );
}

export default DataComponents;
