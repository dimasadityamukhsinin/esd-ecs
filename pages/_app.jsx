import '@/styles/main.scss'
import { useRouter } from 'next/router'
import { DefaultSeo } from 'next-seo'
import SEO from '@/helpers/seo.config'
import { AppWrapper } from '../context/state.js'

export default function App({ Component, pageProps }) {
  const router = useRouter()

  return (
    <>
      <DefaultSeo {...SEO} />

      <AppWrapper>
        <Component {...pageProps} key={router.asPath} />
      </AppWrapper>
    </>
  )
}
