import { UseAuthContext } from "../context/AuthContext";
import { UseNavigateContext } from "../context/NavigateContext";

export default function validateLogin() {
    const { isAuthenticated, setIsAuthenticated, token } = UseAuthContext();
    const { router } = UseNavigateContext();
    if (!token || !isAuthenticated) {
        setIsAuthenticated(false);
        router.push("/auth/login");
    }
}
