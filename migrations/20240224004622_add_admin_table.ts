import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('slips', table => {
      table.uuid('id').primary();
      table.date('due_date').notNullable();
      table.float('total_in_cents').notNullable();
      table.string('customer').notNullable();
      table.string('status').defaultTo('PENDING');
      table.date('payment_date').defaultTo(null);
    })
    .createTable('admin', table => {
      table.string('email').primary();
      table.string('user').notNullable();
      table.string('password').notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('slips').dropTable('admin');
}
