interface BoletosI {
  id: number;
  due_date: Date;
  total_in_cents: number;
  customer: string;
  status: string;
  payment_date: Date;
}

export { BoletosI };
