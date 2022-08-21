import Container from '@/components/modules/container'
import Header from '@/components/modules/header'
import Layout from '@/components/modules/layout'
import FancyLink from '@/components/utils/fancyLink'
import nookies from 'nookies'
import axios from 'axios'
import { useEffect, useState } from 'react'
import flash from 'next-flash'
import { useRouter } from 'next/router'
import SEO from '@/components/utils/seo'

const Account = ({ seo, user, token, flashData, checkNotif }) => {
  const router = useRouter()
  const [field, setField] = useState({
    username: user.username,
    Full_Name: user.Full_Name,
  })
  const [progress, setProgress] = useState(false)
  const [error, setError] = useState({
    username: '',
    Full_Name: '',
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

  const doUpdate = async (e) => {
    if (validateSubmit(e)) {
      e.preventDefault()
    } else {
      setProgress(true)
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(field),
        },
      )
      const res = await req.json()
      setProgress(false)

      router.reload(window.location.pathname)
      flash.set({
        type: 'update',
        message: 'You’ve updated your profile.',
      })
    }
  }

  const ShowFlash = () => {
    let message = flashData.message
    // Make sure we're in the browser
    if (typeof window !== 'undefined') {
      flash.set(null)
    }
    return <>{message}</>
  }

  const validateSubmit = (e) => {
    const usernameTarget = e.target[0]
    const username = usernameTarget.name
    const usernameValue = usernameTarget.value

    const fullNameTarget = e.target[1]
    const fullName = fullNameTarget.name
    const fullNameValue = fullNameTarget.value

    const stateObj = { username: '', Full_Name: '' }

    if (username) {
      if (!usernameValue) {
        stateObj.username = 'Please enter Username.'
      }
    }

    if (fullName) {
      if (!fullNameValue) {
        stateObj.Full_Name = 'Please enter Full Name.'
      }
    }

    setError(stateObj)
    if (stateObj.username || stateObj.Full_Name) {
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
        case 'username':
          if (!value) {
            stateObj[name] = 'Please enter Username.'
          }
          break

        case 'Full_Name':
          if (!value) {
            stateObj[name] = 'Please enter Full Name.'
          }
          break

        default:
          break
      }

      return stateObj
    })
  }

  useEffect(() => {
    if (!user.username || !user.email || !user.Full_Name) {
      flash.set({
        type: 'warning',
        message:
          'Please complete your personal data such as Username, Email, and Full Name!',
      })
    }
  }, [])

  return (
    <Layout>
      <SEO
        title={'Account'}
        defaultSEO={typeof seo !== 'undefined' && seo}
        webTitle={typeof seo !== 'undefined' && seo.Website_Title}
      />
      <Header user={user} notif={checkNotif} />
      <div className="w-full mt-4 md:mt-6 xl:mt-8 text-center font-medium">
        <h2>Your Account</h2>
      </div>
      <Container className="mt-4 md:mt-6 xl:mt-8 border-t bg-gray-50">
        <div className="w-full flex flex-col pt-8 pb-8">
          <div className="setflex-center-row space-x-8">
            <FancyLink
              destination="/account"
              className="border-b border-yellow-500 pb-2 text-yellow-500 text-xl font-medium"
            >
              About you
            </FancyLink>
            <FancyLink
              destination="/account/email"
              className="pb-2 text-yellow-500 text-xl font-medium"
            >
              Email address
            </FancyLink>
            <FancyLink
              destination="/account/password"
              className="pb-2 text-yellow-500 text-xl font-medium"
            >
              Password
            </FancyLink>
          </div>
          <div className="flex flex-col max-w-md w-full mx-auto px-12 mt-12">
            <div className="flex flex-col">
              {flashData ? (
                flashData.type === 'update' ? (
                  <div className="bg-green-500 text-white rounded mb-4 px-4 py-3">
                    <ShowFlash />
                  </div>
                ) : (
                  <div className="bg-yellow-400 text-white rounded mb-4 px-4 py-3">
                    <ShowFlash />
                  </div>
                )
              ) : (
                <></>
              )}
              <span className="text-2xl font-medium">About you</span>
              <form method="put" onSubmit={doUpdate} className="mt-6">
                <div className="flex flex-col">
                  <div className="h-full w-full flex flex-col mb-5">
                    <label className="font-medium">Username *</label>
                    <input
                      type="text"
                      name="username"
                      onChange={setValue}
                      onBlur={validateInput}
                      className="w-full h-11 border p-2 mt-2"
                      value={field.username}
                    />
                    {error.username && (
                      <span className="block text-red-500">
                        {error.username}
                      </span>
                    )}
                  </div>
                  <div className="h-full w-full flex flex-col mb-5">
                    <label className="font-medium">Full Name *</label>
                    <input
                      type="text"
                      name="Full_Name"
                      onChange={setValue}
                      onBlur={validateInput}
                      className="w-full h-11 border p-2 mt-2"
                      value={field.Full_Name}
                    />
                    {error.Full_Name && (
                      <span className="block text-red-500">
                        {error.Full_Name}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={progress}
                  className="bg-yellow-400 w-full mt-5 text-white font-medium py-2 px-3"
                >
                  Save changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  )
}

Account.getInitialProps = async (ctx) => {
  const cookies = nookies.get(ctx)

  if (!cookies.token) {
    ctx.res.writeHead(302, {
      Location: '/login',
    })
    ctx.res.end()
  }

  const reqSeo = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/setting?populate=deep`,
  )
  const seo = await reqSeo.json()

  const user = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
    {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    },
  )

  const reqNotifAll = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/notifications?filters[All][$eq]=true&populate=deep`,
    {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    },
  )
  const notifAll = await reqNotifAll.json()

  const reqNotifDetail = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/notifications?filters[users_permissions_users][id][$eq]=${user.data.id}&populate=deep`,
    {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    },
  )
  const notifDetail = await reqNotifDetail.json()

  const reqCheckNotif = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/notifications?filters[Read][idUser][$eq]=${user.data.id}&populate=deep`,
    {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    },
  )
  const checkNotif = await reqCheckNotif.json()

  const all = [
    ...notifAll.data,
    ...notifDetail.data.filter((data) => data.attributes.All === false),
  ]

  return {
    seo: seo.data.attributes,
    token: cookies.token,
    user: user.data,
    flashData: flash.get(ctx),
    checkNotif: checkNotif.data.length === all.length ? false : true,
  }
}

export default Account
