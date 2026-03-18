import { Role } from "../generated/prisma/enums";

// export enum UserRole {
//   AUTHOR = "AUTHOR",
//   READER = "READER",
// }

export class CreateUserPayload {
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly email: string;
  public readonly password: string;

  public readonly role: Role;
  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: Role,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}
