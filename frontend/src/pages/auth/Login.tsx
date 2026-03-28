import { MdAlternateEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { useFormik } from "formik";
import { loginSchema } from "../../lib/schemas/loginSchema";
import type { LoginType } from "../../types/loginTypes";
import { handleSubmitLogin } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: loginSchema,

    onSubmit: async (values: LoginType) => {
      const { data } = await handleSubmitLogin(values);
      const user = data.user;
      const token = data.accessToken;

      console.log("user token", user, token);

      setAuth(token, user);

      if (user.role === "AUTHOR") {
        navigate("/author/management", { replace: true });
      } else {
        navigate("/blog");
      }
    },
  });

  return (
    <main className="h-dvh flex justify-center items-center">
      <div className="w-[50%]">
        <div className="flex justify-center items-center">
          <h1 className="text-3xl">Login</h1>
        </div>

        {/* form */}
        <div>
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-5 justify-center items-center pt-10">
            {/* email */}

            <div>
              <label className="input">
                <MdAlternateEmail className="text-stone-400 text-xl" />
                <input
                  id="email"
                  name="email"
                  type="text"
                  className="grow input-lg"
                  placeholder="Email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
              </label>
              {formik.errors.email && (
                <p className="text-red-800 text-sm pt-3">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* password */}
            <div>
              <label className="input">
                <RiLockPasswordLine className="text-stone-400 text-xl" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="grow input-lg"
                  placeholder="Password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
              </label>
              {formik.errors.password && (
                <p className="text-red-800 text-sm pt-3">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <button type="submit" className="btn btn-outline">
              Submit
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Login;
