import React, { useState } from 'react';
import { arrayOf, string, bool, number, shape } from 'prop-types';
import { css } from '@emotion/core';
import { gql, useMutation } from '@apollo/client';
import GetTransactions from '../../gql/transactions.gql';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const styles = css`
  .header {
    font-weight: bold;
    background-color: black;
    color: white;
  }

  td {
    padding: 25px;
    width: 14.28%;
  }
  tr {
    width: 80%;
  }
`;

const makeDataTestId = (transactionId, fieldName) => `transaction-${transactionId}-${fieldName}`;

const REMOVE_TRANSACTION = gql`
  mutation removeTransaction($id: ID!) {
    deleteTransaction(id: $id) {
      id
    }
  }
`;

export function TxTable({ data }) {
  const [romanDisplay, setRomanDisplay] = useState(false);
  const [transactionRemove] = useMutation(REMOVE_TRANSACTION, {
    update(cache, { data, id }) {
      const existingTransactions = cache.readQuery({ query: GetTransactions });
      const newTransactions = existingTransactions.transactions.filter(t => t.id !== id);
      cache.writeQuery({
        query: GetTransactions,
        data: { transactions: newTransactions }
      });
    }
  });
  // const history = useHistory();

  const handleTransactionRemove = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    transactionRemove({
      variables: { id }
    });
    // history.push('/');
  };

  const toRoman = (number = 0) => {
    const _roman = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1
    };
    return Object.keys(_roman).reduce((acc, key) => {
      while (number >= _roman[key]) {
        acc += key;
        number -= _roman[key];
      }
      return acc;
    }, '');
  };

  return (
    <>
      <Button onClick={() => setRomanDisplay(!romanDisplay)}>Toggle Roman Numerals</Button>
      <table css={styles}>
        <tbody>
          <tr className="header">
            <td>ID</td>
            <td>User ID</td>
            <td>Description</td>
            <td>Merchant ID</td>
            <td>Debit</td>
            <td>Credit</td>
            <td>Amount</td>
          </tr>
          {data.map(tx => {
            const { id, user_id: userId, description, merchant_id: merchantId, debit, credit, amount } = tx;
            return (
              <tr data-testid={`transaction-${id}`} key={`transaction-${id}`}>
                <td data-testid={makeDataTestId(id, 'id')}>{id}</td>
                <td data-testid={makeDataTestId(id, 'userId')}>{userId}</td>
                <td data-testid={makeDataTestId(id, 'description')}>{description}</td>
                <td data-testid={makeDataTestId(id, 'merchant')}>{merchantId}</td>
                <td data-testid={makeDataTestId(id, 'debit')}>{debit}</td>
                <td data-testid={makeDataTestId(id, 'credit')}>{credit}</td>
                <td data-testid={makeDataTestId(id, 'amount')}>{romanDisplay ? toRoman(amount) : amount}</td>
                <td>
                  <Button className="waves-effect waves-light btn red" onClick={e => handleTransactionRemove(e, id)}>
                    Delete
                  </Button>
                </td>
                <td>
                  <Button>Update</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

TxTable.propTypes = {
  data: arrayOf(
    shape({
      id: string,
      user_id: string,
      description: string,
      merchant_id: string,
      debit: bool,
      credit: bool,
      amount: number
    })
  )
};
