export default class {
  public static calculate(slip: any, currentDate: number, dueDate: number) {
    const epochValue = 86400000;
    const countDays = Math.floor((currentDate - dueDate) / epochValue);
    let fine;

    if (currentDate > dueDate && currentDate <= dueDate + 10 * epochValue) {
      fine = slip.total_in_cents * countDays * (0.5 / 100);
    } else if (currentDate > dueDate + 10 * epochValue) {
      fine = slip.total_in_cents * countDays * (1 / 100);
    }
    return fine;
  }
}
