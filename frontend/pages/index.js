import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import Head from 'next/head'
import Dashboard from '../components/Dashboard'

export default function Home() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const token = Cookies.get('auth_token')
    const guest = localStorage.getItem('user')

    if (!token && !guest) {
      router.push('/login')
    } else {
      setAuthenticated(true)
    }
  }, [router])

  if (!authenticated) return null;

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
