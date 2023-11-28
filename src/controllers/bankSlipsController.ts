import { Request, Response } from 'express';
import db from '../database/connection';
import { v4 as uuidv4 } from 'uuid';
import { generateToken } from '../utils/token-manipulator';

export const postSlip = async (request: Request, response: Response) => {
  const slip = request.body;

  if (
    slip.total_in_cents !== undefined &&
    slip.due_date !== undefined &&
    slip.customer !== undefined &&
    typeof slip.total_in_cents === 'number' &&
    typeof slip.due_date === 'string' &&
    typeof slip.customer === 'string'
  ) {
    const uuid = uuidv4();

    try {
      await db('slips').insert({ ...slip, id: uuid });

      return response
        .status(200)
        .send(
          await db('slips')
            .select('id', 'due_date', 'total_in_cents', 'customer', 'status')
            .where('id', uuid)
            .first(),
        );
    } catch (err) {
      console.log(err);
      return response
        .status(400)
        .send('Bankslip not provided in the request body');
    }
  } else {
    return response.status(422).send(
      `<p>Invalid bankslip provided. The possible reasons are: <br/>
      • A field of the provided bankslip was null or with invalid values</p>`,
    );
  }
};

export const getSlips = async (request: Request, response: Response) => {
  try {
    const slips = await db('slips').select(
      'id',
      'due_date',
      'total_in_cents',
      'customer',
      'status',
    );
    return response.status(200).send(slips);
  } catch (err) {
    console.log(err);
    return response.status(400).send('Bankslips not found');
  }
};

export const paySlip = async (request: Request, response: Response) => {
  const id = request.params.id;
  const slip = request.body;

  const paydedSlip = await db('slips')
    .where({ id: id })
    .update({ status: 'PAID', payment_date: slip.payment_date });

  if (paydedSlip > 0) {
    return response.status(200).send('No content');
  } else {
    return response
      .status(404)
      .send('Bankslip not found with the specified id');
  }
};

export const cancelSlip = async (request: Request, response: Response) => {
  const id = request.params.id;

  try {
    const canceledSlip = await db('slips')
      .where({ id: id })
      .update({ status: 'CANCELED' });
    if (canceledSlip > 0) {
      return response.status(200).send('Bankslip canceled');
    } else {
      return response
        .status(404)
        .send('Bankslip not found with the specified id');
    }
  } catch (err) {
    console.log(err);
  }
};
