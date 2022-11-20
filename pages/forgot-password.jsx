import Layout from '@/components/modules/layout'
import { useState } from 'react'
import FancyLink from '@/components/utils/fancyLink'
import nookies from 'nookies'
import SEO from '@/components/utils/seo'
import Image from 'next/image'
import FlashMessage from 'react-flash-message'
import axios from 'axios'

const ForgotPassword = ({ seo }) => {
  const [showMessage, setShowMessage] = useState(null)
  const [progress, setProgress] = useState(false)

  const doForgot = async (e) => {
    e.preventDefault()
    setProgress(true)
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        email: e.target.email.value,
      })
      .then((response) => {
        setShowMessage({
          type: 'success',
          message: 'Success, check your email!',
        })
        setProgress(false)
      })
      .catch((error) => {
        setShowMessage({
          type: 'error',
          message: `An error occurred:${error.response}`,
        })
        setProgress(false)
      })
  }

  return (
    <Layout>
      <SEO
        title={'Forgotten Password'}
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
          {showMessage ? (
            showMessage.type === 'success' ? (
              <FlashMessage duration={6000}>
                <div className="bg-green-500 text-white rounded mb-4 px-4 py-3">
                  {showMessage.message}
                </div>
              </FlashMessage>
            ) : (
              showMessage.type === 'error' && (
                <FlashMessage duration={6000}>
                  <div className="bg-red-500 text-white rounded mb-4 px-4 py-3">
                    {showMessage.message}
                  </div>
                </FlashMessage>
              )
            )
          ) : (
            <></>
          )}
          <div className="w-full">
            <FancyLink
              destination="/login"
              className="space-x-2 font-semibold text-md text-gray-600 mb-3 ml-1 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 inline-block rotate-180"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
              <span>Login</span>
            </FancyLink>
          </div>
          <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
            <form
              method="post"
              onSubmit={doForgot}
              className="relative px-5 py-7"
            >
              {progress && (
                <div className="absolute inset-0 z-10 bg-white/50" />
              )}
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Email
              </label>
              <input
                type="email"
                name="email"
                className={`border rounded-lg px-3 py-2 mt-1 text-sm w-full mb-5`}
                required
              />
              <button
                disabled={progress}
                type="submit"
                className="transition duration-200 bg-blue-800 hover:bg-blue-800 focus:bg-blue-800 focus:shadow-sm focus:ring-4 focus:ring-blue-800 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              >
                <span className="inline-block mr-2">Reset Password</span>
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

export default ForgotPassword
