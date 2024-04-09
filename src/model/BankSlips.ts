export default class BankSlips {
  public id?: string;
  public due_date: Date;
  public total_in_cents: number;
  public customer: string;
  public status?: string;
  public payment_date: Date;

  constructor(
    due_date: Date,
    total_in_cents: number,
    customer: string,
    payment_date: Date,
    id?: string,
    status?: string,
  ) {
    this.id = id;
    this.due_date = due_date;
    this.total_in_cents = total_in_cents;
    this.customer = customer;
    this.status = status;
    this.payment_date = payment_date;
  }
}
