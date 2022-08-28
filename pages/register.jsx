import Layout from '@/components/modules/layout'
import { useEffect, useState } from 'react'
import nookies from 'nookies'
import SEO from '@/components/utils/seo'
import Image from 'next/image'
import FancyLink from '@/components/utils/fancyLink'
import FlashMessage from 'react-flash-message'
import { scrollToTop } from '@/components/utils/scrollToTop'

const Register = ({ seo, major }) => {
  const [showMessage, setShowMessage] = useState(null)
  const [field, setField] = useState({})
  const [progress, setProgress] = useState(false)

  const [error, setError] = useState({
    Full_Name: '',
    Nim: '',
    major: '',
    username: '',
    email: '',
    password: '',
  })

  const setValue = (e) => {
    validateInput(e)
  }

  const validateSubmit = (e) => {
    const fullNameTarget = e.target[0]
    const fullName = fullNameTarget.name
    const fullNameValue = fullNameTarget.value

    const nimTarget = e.target[1]
    const nim = nimTarget.name
    const nimValue = nimTarget.value

    const majorTarget = e.target[2]
    const major = majorTarget.name
    const majorValue = majorTarget.value

    const usernameTarget = e.target[3]
    const username = usernameTarget.name
    const usernameValue = usernameTarget.value

    const emailTarget = e.target[4]
    const email = emailTarget.name
    const emailValue = emailTarget.value

    const passwordTarget = e.target[5]
    const password = passwordTarget.name
    const passwordValue = passwordTarget.value

    const stateObj = {
      Full_Name: '',
      Nim: '',
      major: '',
      username: '',
      email: '',
      password: '',
    }

    if (fullName) {
      if (!fullNameValue) {
        stateObj.Full_Name = 'Please enter Full Name.'
      }
    }

    if (nim) {
      if (!nimValue) {
        stateObj.Nim = 'Please enter Nim.'
      }
    }

    if (major) {
      if (!majorValue) {
        stateObj.major = 'Please enter Major.'
      }
    }

    if (username) {
      if (!usernameValue) {
        stateObj.username = 'Please enter Username.'
      }
    }

    if (email) {
      if (!emailValue) {
        stateObj.email = 'Please enter Email.'
      }
    }

    if (password) {
      if (!passwordValue) {
        stateObj.password = 'Please enter Password.'
      } else {
        const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
        if (!regexPassword.test(passwordValue)) {
          stateObj.password =
            'Your password must be at least 8 characters, 1 uppercase, 1 lowercase & 1 number'
        }
      }
    }

    setError(stateObj)
    if (
      stateObj.Full_Name ||
      stateObj.Nim ||
      stateObj.major ||
      stateObj.username ||
      stateObj.email ||
      stateObj.password
    ) {
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
        case 'Full_Name':
          if (!value) {
            stateObj[name] = 'Please enter Full Name.'
          }
          break

        case 'Nim':
          if (!value) {
            stateObj[name] = 'Please enter Nim.'
          }
          break

        case 'major':
          if (!value) {
            stateObj[name] = 'Please enter Major.'
          }
          break

        case 'username':
          if (!value) {
            stateObj[name] = 'Please enter Username.'
          }
          break

        case 'email':
          if (!value) {
            stateObj[name] = 'Please enter Email.'
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

  const doRegister = async (e) => {
    scrollToTop()
    setShowMessage(null)
    e.preventDefault()
    if (validateSubmit(e)) return

    const fullNameTarget = e.target[0]
    const fullName = fullNameTarget.name
    const fullNameValue = fullNameTarget.value

    const nimTarget = e.target[1]
    const nim = nimTarget.name
    const nimValue = nimTarget.value

    const majorTarget = e.target[2]
    const major = majorTarget.name
    const majorValue = majorTarget.value

    const usernameTarget = e.target[3]
    const username = usernameTarget.name
    const usernameValue = usernameTarget.value

    const emailTarget = e.target[4]
    const email = emailTarget.name
    const emailValue = emailTarget.value

    const passwordTarget = e.target[5]
    const password = passwordTarget.name
    const passwordValue = passwordTarget.value

    setProgress(true)

    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/local/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Full_Name: fullNameValue,
          Nim: nimValue,
          major: majorValue,
          username: usernameValue,
          email: emailValue,
          password: passwordValue,
        }),
      },
    )
    const res = await req.json()

    if (res.jwt) {
      setField({})
      e.target.reset()
      setShowMessage({
        type: 'success',
        message: 'Congratulations! Your account has been registered.',
      })
    } else {
      setShowMessage({
        type: 'error',
        message: 'Username, Email or Nim already in use!',
      })
    }

    setProgress(false)
  }

  return (
    <Layout>
      <SEO
        title={'Register'}
        defaultSEO={typeof seo !== 'undefined' && seo}
        webTitle={typeof seo !== 'undefined' && seo.Website_Title}
      />
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
        <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
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
                <div className="bg-green-500 animate-FadeIn text-white rounded mb-4 px-4 py-3">
                  {showMessage.message}
                </div>
              </FlashMessage>
            ) : (
              showMessage.type === 'error' && (
                <FlashMessage duration={6000}>
                  <div className="bg-red-500 animate-FadeIn text-white rounded mb-4 px-4 py-3">
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
              onSubmit={doRegister}
              className="relative px-5 py-7"
            >
              {progress && (
                <div className="absolute inset-0 z-10 bg-white/50" />
              )}
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Full Name
              </label>
              <input
                type="text"
                name="Full_Name"
                onChange={setValue}
                onBlur={validateInput}
                className={`border rounded-lg px-3 py-2 mt-1 text-sm w-full ${
                  !error.Full_Name && 'mb-5'
                }`}
              />
              {error.Full_Name && (
                <span className="block text-red-500 mb-5">
                  {error.Full_Name}
                </span>
              )}
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Nim
              </label>
              <input
                type="number"
                name="Nim"
                onChange={setValue}
                onBlur={validateInput}
                className={`border rounded-lg px-3 py-2 mt-1 text-sm w-full ${
                  !error.Nim && 'mb-5'
                }`}
              />
              {error.Nim && (
                <span className="block text-red-500 mb-5">{error.Nim}</span>
              )}
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Major
              </label>
              <select
                id="lang"
                onChange={setValue}
                onBlur={validateInput}
                name="major"
                className={`border rounded-lg px-3 py-2 mt-1 text-sm w-full ${
                  !error.major && 'mb-5'
                }`}
              >
                {major.map((data) => (
                  <option value={data.id}>{data.attributes.Name}</option>
                ))}
              </select>
              {error.major && (
                <span className="block text-red-500 mb-5">{error.major}</span>
              )}
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Username
              </label>
              <input
                type="text"
                name="username"
                onChange={setValue}
                onBlur={validateInput}
                className={`border rounded-lg px-3 py-2 mt-1 text-sm w-full ${
                  !error.username && 'mb-5'
                }`}
              />
              {error.username && (
                <span className="block text-red-500 mb-5">
                  {error.username}
                </span>
              )}
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Email
              </label>
              <input
                type="email"
                name="email"
                onChange={setValue}
                onBlur={validateInput}
                className={`border rounded-lg px-3 py-2 mt-1 text-sm w-full ${
                  !error.email && 'mb-5'
                }`}
              />
              {error.email && (
                <span className="block text-red-500 mb-5">{error.email}</span>
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
                className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              >
                <span className="inline-block mr-2">Register</span>
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
  const reqSeo = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/setting?populate=deep`,
  )
  const seo = await reqSeo.json()

  const reqMajor = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/majors`)
  const major = await reqMajor.json()

  if (cookies.token) {
    return {
      redirect: {
        destination: '/',
      },
    }
  }

  return {
    props: {
      major: major.data,
      seo: seo.data.attributes,
    },
  }
}

export default Register
