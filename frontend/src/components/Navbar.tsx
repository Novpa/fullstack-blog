import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuthStore } from "../store/useAuthStore";

function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      logout();
      navigate("/login", { replace: true });
      //   window.location.href = "/login";
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <nav className="h-18 bg-stone-900 w-full flex justify-end px-10 items-center">
      <div className="flex gap-5">
        <div>
          <p>{user?.firstName}</p>
        </div>
        <div>
          {user ? (
            <button className="btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link className="btn" to="/signup">
              Signup
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
