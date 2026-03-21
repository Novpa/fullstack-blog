import axios from "axios";
import type { LoginType } from "../types/loginTypes";
import type { User } from "../types/userTypes";

interface LoginResponse {
  accessToken: string;
  user: User;
}

export const handleSubmitLogin = async ({
  email,
  password,
}: LoginType): Promise<LoginResponse> => {
  try {
    const response = await axios.post(
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
    const data: LoginResponse = response.data.data;
    // console.log("data", data);

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("There is something wrong during fetching the API");
  }
};
