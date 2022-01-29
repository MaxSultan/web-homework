import React, { useState } from 'react';
import { css } from '@emotion/core';
import { gql, useMutation } from '@apollo/client';

const ADD_TRANSACTION = gql`
  mutation AddTransaction(
    $description: String
    $user_id: String
    $merchant_id: String
    $debit: Boolean
    $credit: Boolean
    $amount: Float
  ) {
    addTransaction(
      description: $description
      user_id: $user_id
      merchant_id: $merchant_id
      debit: $debit
      credit: $credit
      amount: $amount
    ) {
      id
      user_id
      description
      merchant_id
      debit
      credit
      amount
    }
  }
`;

export default function TxForm() {
  const [id, setId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [description, setDescription] = useState(null);
  const [merchantId, setMerchantId] = useState(null);
  const [debit, setDebit] = useState(false);
  const [credit, setCredit] = useState(false);
  const [amount, setAmount] = useState(null);
  const [addTransaction, { data, loading, error }] = useMutation(ADD_TRANSACTION);

  const styles = css`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: column;
  `;

  const resetForm = () => {
    setId(null);
    setUserId(null);
    setDescription(null);
    setMerchantId(null);
    setDebit(null);
    setCredit(null);
    setAmount(null);
  };

  const onSubmit = event => {
    event.preventDefault();
    addTransaction({ variables: { description, id, userId, merchantId, debit, credit, amount } });
    resetForm();
  };

  if (loading) return 'Submitting...';
  if (error) return `Submission error! ${error.message}`;

  return (
    <div>
      <form css={styles} className="form" onSubmit={onSubmit}>
        <label>
          Id:
          <br></br>
          <input id="id" name="id" value={id} onChange={event => setId(event.target.value)} type="text" />
        </label>
        <label>
          User Id:
          <br></br>
          <input id="userId" name="userId" value={userId} onChange={event => setUserId(event.target.value)} />
        </label>
        <label>
          Description:
          <br></br>
          <input
            id="description"
            name="description"
            value={description}
            onChange={event => setDescription(event.target.value)}
            type="text"
          />
        </label>
        <label>
          Merchant Id:
          <br></br>
          <input
            id="merchantId"
            name="merchantId"
            value={merchantId}
            onChange={event => setMerchantId(event.target.value)}
          />
        </label>
        <fieldset>
          <label>
            Debit:
            <input type="radio" id="debit" name="chargeType" value={debit} onChange={() => setDebit(!debit)} />
          </label>
          <label>
            Credit:
            <input type="radio" id="credit" name="chargeType" value={credit} onChange={() => setCredit(!credit)} />
          </label>
        </fieldset>
        <label>
          Amount:
          <br></br>
          <input
            id="amount"
            name="amount"
            value={amount}
            onChange={event => setAmount(parseInt(`${event.target.value}.00`))}
            type="number"
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
