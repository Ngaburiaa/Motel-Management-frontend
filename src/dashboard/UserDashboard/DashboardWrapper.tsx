import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import Dashboard from "../../components/dashboard/Dashboard";


export const DashboardWrapper = () => {
    const {userId} = useSelector((state: RootState) => state.auth);
    const id = Number(userId);
  if (!userId) return <div>Please log in</div>;

  return (
    <div>
      <Dashboard userId={id} />
    </div>
  );
};
