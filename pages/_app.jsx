import '@/styles/main.scss'
import { useRouter } from 'next/router'
import { DefaultSeo } from 'next-seo'
import SEO from '@/helpers/seo.config'
import { AppWrapper } from '../context/state.js'
import { AnimatePresence } from 'framer-motion';

export default function App({ Component, pageProps }) {
  const router = useRouter()

  return (
    <>
      <DefaultSeo {...SEO} />

      <AnimatePresence exitBeforeEnter>
        <AppWrapper>
          <Component {...pageProps} key={router.asPath} />
        </AppWrapper>
      </AnimatePresence>
    </>
  )
}
