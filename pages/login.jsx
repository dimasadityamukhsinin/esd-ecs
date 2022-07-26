import Layout from '@/components/modules/layout'
import { useState } from 'react'
import FancyLink from '@/components/utils/fancyLink'
import nookies from 'nookies'
import SEO from '@/components/utils/seo'
import Router from 'next/router'
import { useRouter } from 'next/router'
import Image from 'next/image'
import FlashMessage from 'react-flash-message'

const Login = ({ seo }) => {
  const [showMessage, setShowMessage] = useState(null)
  const [field, setField] = useState({})
  const [progress, setProgress] = useState(false)
  const route = useRouter()

  const [error, setError] = useState({
    identifier: '',
    password: '',
  })

  const setValue = (e) => {
    const target = e.target
    const name = target.name
    const value = target.value

    setField({
      ...field,
      [name]: value,
    })
    validateInput(e)
  }

  const validateSubmit = (e) => {
    const identifierTarget = e.target[0]
    const identifier = identifierTarget.name
    const identifierValue = identifierTarget.value

    const passwordTarget = e.target[1]
    const password = passwordTarget.name
    const passwordValue = passwordTarget.value

    const stateObj = { identifier: '', password: '' }

    if (identifier) {
      if (!identifierValue) {
        stateObj.identifier = 'Please enter Username.'
      }
    }

    if (password) {
      if (!passwordValue) {
        stateObj.password = 'Please enter Password.'
      }
    }
    setError(stateObj)
    if (stateObj.identifier || stateObj.password) {
      return true
    } else {
      return false
    }
  }

  const validateInput = (e) => {
    let { name, value } = e.target
    setError((prev) => {
      const stateObj = { ...prev, [name]: '' }

      switch (name) {
        case 'identifier':
          if (!value) {
            stateObj[name] = 'Please enter Username.'
          }
          break

        case 'password':
          if (!value) {
            stateObj[name] = 'Please enter Password.'
          }
          break

        default:
          break
      }

      return stateObj
    })
  }

  const doLogin = async (e) => {
    setShowMessage(null)
    e.preventDefault()
    if (validateSubmit(e)) return

    setProgress(true)

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
      setProgress(false)
    } else {
      setProgress(false)
      setShowMessage('Wrong username or password!')
    }
  }

  return (
    <Layout>
      <SEO
        title={'Login'}
        defaultSEO={typeof seo !== 'undefined' && seo}
        webTitle={typeof seo !== 'undefined' && seo.Website_Title}
      />
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
        <div className="mx-auto md:w-full md:max-w-md">
          <div className="relative w-full h-32 aspect-square mb-6">
            <Image
              src={seo.Logo.data.attributes.url}
              alt={seo.Website_Title}
              layout="fill"
              objectFit="contain"
            />
          </div>
          {showMessage && (
            <FlashMessage duration={6000}>
              <div className="bg-red-500 text-white rounded mb-4 px-4 py-3">
                {showMessage}
              </div>
            </FlashMessage>
          )}
          <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
            <form
              method="post"
              onSubmit={doLogin}
              className="relative px-5 py-7"
            >
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
                onBlur={validateInput}
                className={`border rounded-lg px-3 py-2 mt-1 text-sm w-full ${
                  !error.identifier && 'mb-5'
                }`}
              />
              {error.identifier && (
                <span className="block text-red-500 mb-5">
                  {error.identifier}
                </span>
              )}
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                onChange={setValue}
                onBlur={validateInput}
                className={`border rounded-lg px-3 py-2 mt-1 text-sm w-full ${
                  !error.password && 'mb-5'
                }`}
              />
              {error.password && (
                <span className="block text-red-500 mb-5">
                  {error.password}
                </span>
              )}
              <button
                disabled={progress}
                type="submit"
                className="transition duration-200 bg-blue-800 hover:bg-blue-800 focus:bg-blue-800 focus:shadow-sm focus:ring-4 focus:ring-blue-800 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
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
                <div className="text-right whitespace-nowrap">
                  <FancyLink
                    destination="/forgot-password"
                    className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset"
                  >
                    <span className="inline-block ml-1">Forgotten Password?</span>
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

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx)
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/setting?populate=deep`,
  )
  const seo = await req.json()

  if (cookies.token) {
    return {
      redirect: {
        destination: '/',
      },
    }
  }

  return {
    props: {
      seo: seo.data.attributes,
    },
  }
}

export default Login
