import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { signInAction } from "../../redux/actions/authAction";
import { clearAuthMessages } from "../../redux/slices/authSlice";

function SignIn() {
  const { userType } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Signing in...");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userId: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { signInError, successMessage, user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (user?.token) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (signInError) {
      dispatch(clearAuthMessages());
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setLoadingText("Signing in...");

    const timeout = setTimeout(() => {
      setLoadingText("This is taking longer than usual. Please wait...");
    }, 5000);

    try {
      const credentials = {
        email: formData.email,
        password: formData.password,
        userType,
      };

      const res = await dispatch(signInAction(credentials));

      if (res) navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md  text-black">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black">{userType} Login</h2>
        </div>

        <form className="mt-8 space-y-6 p-6" onSubmit={handleSubmit}>
          <div className="space-y-4 ">
            {userType === "Admin" ? (
              <div>
                <label className="block text-sm font-medium text-black">
                  Admin ID
                </label>
                <input
                  name="userId"
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-900 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
                  value={formData.userId}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-black">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-black">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {signInError && (
            <div className="text-red-600 text-sm text-center py-2">
              {signInError}
            </div>
          )}

          {successMessage && (
            <div className="text-green-600 text-sm text-center py-2">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {loadingText}
              </>
            ) : (
              "Sign in"
            )}
          </button>
          <p>
            If Don't have account/
            <Link to={`/signup/${userType}`}>Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
