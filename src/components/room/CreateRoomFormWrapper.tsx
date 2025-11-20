// CreateRoomFormWrapper.tsx
import { useParams } from "react-router-dom";
import CreateRoomForm from "../../dashboard/AdminDashboard/CreateRoom";

const CreateRoomFormWrapper = () => {
  const { hotelId } = useParams();

  const parsedId = hotelId ? parseInt(hotelId, 10) : null;

  if (!parsedId || isNaN(parsedId)) {
    return <div className="text-red-500">Invalid or missing hotel ID</div>;
  }

  return <CreateRoomForm hotelId={parsedId} />;
};

export default CreateRoomFormWrapper;
