import axios from "axios";
import type { LoginType } from "../types/loginTypes";
// import type { User } from "../types/userTypes";

// interface LoginResponse {
//   accessToken: string;
//   user: User;
// }

export const handleSubmitLogin = async ({ email, password }: LoginType) => {
  try {
    const { data } = await axios.post(
      "http://localhost:8000/api/auth/login",
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    );
    console.log("data-login", data);

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("There is something wrong during fetching the API");
  }
};
