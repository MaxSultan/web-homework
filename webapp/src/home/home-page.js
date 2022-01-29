import React, { Fragment } from 'react';
import { useQuery } from '@apollo/client';
import GetTransactions from '../gql/transactions.gql';
import { TxTable } from '../components/transactions/TxTable';
import TxHistogram from '../components/Histogram/TxHistogram';

export function Home() {
  const { loading, error, data = {} } = useQuery(GetTransactions);

  if (loading) {
    return <Fragment>Loading...</Fragment>;
  }

  if (error) {
    return <Fragment>¯\_(ツ)_/¯</Fragment>;
  }

  return (
    <Fragment>
      <TxHistogram data={data.transactions} />
      <TxTable data={data.transactions} />
    </Fragment>
  );
}
