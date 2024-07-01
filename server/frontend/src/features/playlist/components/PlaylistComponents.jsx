import selectedPlaylistStore from "../stores/selectedPlaylistStore";
import PlaylistDetailsComponents from "./PlaylistDetailsComponents";
import PlaylistListComponents from "./PlaylistListComponents";

function PlaylistComponents() {
  const { selectedPlaylist } = selectedPlaylistStore();

  return (
    <div>
      {selectedPlaylist?.id ? (
        <PlaylistDetailsComponents />
      ) : (
        <PlaylistListComponents />
      )}
    </div>
  );
}

export default PlaylistComponents;
