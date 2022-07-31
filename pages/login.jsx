import Layout from '@/components/modules/layout'
import Header from '@/components/modules/header'
import { useEffect, useState } from 'react'
import FancyLink from '@/components/utils/fancyLink'
import nookies from 'nookies'
import SEO from '@/components/utils/seo'
import flash from 'next-flash'
import Router from 'next/router'
import { useRouter } from 'next/router'
import axios from 'axios'

const Login = ({ seo, flashData }) => {
  const [field, setField] = useState({})
  const [progress, setProgress] = useState(false)
  const route = useRouter()

  const setValue = (e) => {
    const target = e.target
    const name = target.name
    const value = target.value

    setField({
      ...field,
      [name]: value,
    })
  }

  const doLogin = async (e) => {
    setProgress(true)
    e.preventDefault();

    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/local`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(field),
      },
    )
    const res = await req.json()

    if (res.jwt) {
      nookies.set(null, 'token', res.jwt)
      Router.replace('/')
    } else {
      route.reload(window.location.pathname)
      flash.set('Wrong username or password!')
    }

    setProgress(false)
  }

  const ShowFlash = () => {
    useEffect(() => {
      flash.set(null)
    }, [])
    return <>{flashData}</>
  }

  return (
    <Layout>
      <Header />
      <SEO
        title={'Login'}
        defaultSEO={typeof seo !== 'undefined' && seo}
        webTitle={typeof seo !== 'undefined' && seo.Website_Title}
      />
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
        <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
          <h1 className="font-bold text-center text-2xl mb-5">ESD in ECS</h1>
          {flashData && (
            <div className="bg-red-500 text-white rounded mb-4 px-4 py-3">
              <ShowFlash />
            </div>
          )}
          <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
            <form method="post" onSubmit={doLogin} className="px-5 py-7">
              {progress && (
                <div className="absolute inset-0 z-10 bg-white/50" />
              )}
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Username
              </label>
              <input
                type="text"
                name="identifier"
                onChange={setValue}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                onChange={setValue}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <button
                disabled={progress}
                type="submit"
                className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              >
                <span className="inline-block mr-2">Login</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4 inline-block"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </form>
            <div className="p-5">
              <button
                type="button"
                className="transition duration-200 border border-gray-200 text-gray-500 w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-normal text-center inline-block"
              >
                Login with Google
              </button>
            </div>
            <div className="py-5">
              <div className="grid grid-cols-2 gap-1">
                <div className="text-center sm:text-left whitespace-nowrap">
                  <FancyLink
                    destination="/register"
                    className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset"
                  >
                    <span className="inline-block ml-1">Register</span>
                  </FancyLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

Login.getInitialProps = async (ctx) => {
  const cookies = nookies.get(ctx)
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/setting?populate=deep`,
  )
  const seo = await req.json()

  if (cookies.token) {
    ctx.res.writeHead(302, {
        Location: '/'
    });
    ctx.res.end();
  }

  return {
    seo: seo.data.attributes,
    flashData: flash.get(ctx),
  }
}

export default Login
