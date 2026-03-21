export interface User {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  role: "AUTHOR" | "READER";
}
