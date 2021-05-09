import Head from 'next/head'
import {Fragment} from 'react'

import App from '../app/App'

export default function WebApp() {

  return (
    <Fragment>
      <Head>
        <title>Inventory Management</title>
        <meta name="description" content="Inventory management for groceries storage room" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <App />
    </Fragment>
  )
}
