import db from '../infra/connection';
import BankSlips from '../model/BankSlips';

export default class BankSlipsRepository {
    private tableName = 'slips';

    public async findAll(): Promise<BankSlips[]> {
        return await db(this.tableName).select('*');
    }

    public async add(slip: BankSlips, id: string): Promise<void> {
        await db(this.tableName).insert({ ...slip, id: id });
    }

    public async findById(id: string): Promise<BankSlips | null> {
        return await db(this.tableName).select('*').where({ id: id }).first();
    }

    public async updateStatus(id: string, status: string): Promise<void> {
        await db(this.tableName).where({ id: id }).update({ status: status });
    }

    public async pay(id: string, status: string, payment_date: Date): Promise<void> {
        await db(this.tableName).where({ id: id }).update({
            status: status,
            payment_date: payment_date,
        });
    }
}