import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/authSlice";
import bgImage from "../assets/Mountains.jpg";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (

    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="w-full max-w-sm rounded-2xl bg-transparent-400 shadow-2xl px-8 py-9 text-center border-white/30">
        <h1 className="text-2xl font-bold text-gray-500 mb-2">
          Welcome{user?.name ? `, ${user.name}` : ""}!
        </h1>
        <p className="text-white font-medium mb-6">
          You have successfully logged in.
        </p>
        {user?.email && (
          <p className="text-sm text-gray-600 mb-6">{user.email}</p>
        )}
        <button
          onClick={handleLogout}
          className="w-full rounded-full bg-white text-black font-semibold text-sm py-2.5 hover:bg-gray-300 transition-all"
        >
          logout
        </button>
      </div>
    </div>
  );
}