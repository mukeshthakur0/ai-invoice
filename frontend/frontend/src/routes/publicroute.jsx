import { Navigate } from "react-router-dom";
import { useAuth } from "../services/authcontext";

const PublicRoute = ({ children }) => {
  return children;
};


export default PublicRoute;