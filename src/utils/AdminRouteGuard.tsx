// AdminRouteGuard.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "../components/common/Loading";
import type { RootState } from "../app/store";
import { useSelector } from "react-redux";
import { useGetUserByIdQuery } from "../features/api";

export const AdminRouteGuard = ({ children }: { children: React.ReactNode }) => {
    const {userId} = useSelector((state: RootState) => state.auth);
  const { data: user, isLoading, isError } = useGetUserByIdQuery(Number(userId));
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isError && user?.role !== "admin") {
      navigate("/");
    }
  }, [user, isLoading, isError, navigate]);

  if (isLoading) {
    return <Loading/>;
  }

  if (isError || user?.role !== "admin") {
    return <div>Unauthorized access</div>;
  }

  return <>{children}</>;
};