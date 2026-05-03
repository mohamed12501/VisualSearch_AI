import Head from 'next/head'
import Dashboard from '../components/Dashboard'

export default function Home() {
  return (
    <div>
      <Head>
        <title>VisualSearch AI | Intelligent Product Research</title>
        <meta name="description" content="Analyze product images using AI to get structured research results and summaries." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Dashboard />
      </main>
    </div>
  )
}
