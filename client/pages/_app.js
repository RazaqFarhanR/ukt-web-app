import '@/styles/globals.css'
import Context from '@/context/context'
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>UKT CABANG TRENGGALEK</title>
        <link rel="shortcut icon" type="image/png" href="/images/ikonn.png" />
      </Head>
      <Context>
        <Component {...pageProps} />
      </Context>
    </>
  )
}
