export enum UserRole {
  AUTHOR = "AUTHOR",
  READER = "READER",
}

export class createUserPayload {
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly email: string;
  public readonly password: string;

  public readonly role: UserRole;
  constructor(
    firstname: string,
    lastName: string,
    email: string,
    password: string,
    role: UserRole,
  ) {
    this.firstName = firstname;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}
