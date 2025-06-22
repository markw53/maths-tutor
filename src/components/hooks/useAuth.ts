import { useContext } from "react";
import AuthContext from "@/contexts/AuthContext";

// Custom hook to use AuthContext everywhere
const useAuth = () => useContext(AuthContext);

export default useAuth;