import BankSlipsDao from '../model/dao/bankSlipsDao';

export default class FineCalculatorServices {
  public static calculate(slip: any, insertedDate: number, dueDate: number) {
    const epochValue = 86400000;
    const countDays = (insertedDate - dueDate) / epochValue;
    let fine;

    if (insertedDate > dueDate && insertedDate <= dueDate + 10 * epochValue) {
      fine = slip.total_in_cents * countDays * (0.5 / 100);
    } else if (insertedDate > dueDate + 10 * epochValue) {
      fine = slip.total_in_cents * countDays * (1 / 100);
    } else {
      fine = 0;
    }
    return parseFloat(fine.toFixed(2));
  }

  public static async fineCalculator(id: string) {
    try {
      const slip = await BankSlipsDao.findById(id);
      const currentDate = new Date().getTime();
      const paymentDate = new Date(slip.payment_date).getTime();
      const dueDate = new Date(slip.due_date).getTime();

      if (slip.status === 'PENDING') {
        const fine = this.calculate(slip, currentDate, dueDate);
        return { ...slip, fine: fine };
      } else if (slip.status === 'PAID') {
        const fine = this.calculate(slip, paymentDate, dueDate);
        return { ...slip, fine: fine };
      } else {
        return slip;
      }
    } catch (err) {
      throw err;
    }
  }
}
