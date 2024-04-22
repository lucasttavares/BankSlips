export default class Admin {
  public email: string;
  public user: string;
  public password: string;

  constructor(email: string, user: string, password: string) {
    this.email = email;
    this.user = user;
    this.password = password;
  }
}
