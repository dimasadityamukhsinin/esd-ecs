import Container from '@/components/modules/container'
import Header from '@/components/modules/header'
import Layout from '@/components/modules/layout'
import FancyLink from '@/components/utils/fancyLink'
import nookies from 'nookies'
import axios from 'axios'
import flash from 'next-flash'
import SEO from '@/components/utils/seo'
import Footer from '@/components/modules/footer'
import { useState } from 'react'
import { useRouter } from 'next/router'
import FlashMessage from 'react-flash-message'

const Password = ({ seo, token, user, checkNotif }) => {
  const [showMessage, setShowMessage] = useState(null)
  const [field, setField] = useState({})
  const [progress, setProgress] = useState(false)

  const [error, setError] = useState({
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

  const doPassword = async (e) => {
    setShowMessage(null)
    e.preventDefault()
    if (validateSubmit(e)) return

    setProgress(true)
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(field),
      },
    )
    const res = await req.json()
    setProgress(false)

    if (res.error) {
      setShowMessage({
        type: 'error',
        message: res.error.message,
      })
    } else {
      setShowMessage({
        type: 'update',
        message: 'You’ve updated your password.',
      })
    }
  }

  const validateSubmit = (e) => {
    const currentTarget = e.target[0]
    const current = currentTarget.name
    const currentValue = currentTarget.value

    const newTarget = e.target[1]
    const newPassword = newTarget.name
    const newValue = newTarget.value

    const confirmationTarget = e.target[2]
    const confirmation = confirmationTarget.name
    const confirmationlValue = confirmationTarget.value

    const stateObj = {
      currentPassword: '',
      newPassword: '',
      passwordConfirmation: '',
    }

    if (current) {
      if (!currentValue) {
        stateObj.currentPassword = 'Please enter Current Password.'
      }
    }

    if (newPassword) {
      if (!newValue) {
        stateObj.newPassword = 'Please enter New Password.'
      } else {
        const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
        if (!regexPassword.test(newValue)) {
          stateObj.newPassword =
            'Your password must be at least 8 characters, and include at least one uppercase letter, and a number.'
        }
      }
    }

    if (confirmation) {
      if (!confirmationlValue) {
        stateObj.passwordConfirmation =
          'Please enter New Password Confirmation.'
      }
    }

    setError(stateObj)
    if (
      stateObj.currentPassword ||
      stateObj.newPassword ||
      stateObj.passwordConfirmation
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
        case 'currentPassword':
          if (!value) {
            stateObj[name] = 'Please enter Current Password.'
          }
          break

        case 'password':
          if (!value) {
            stateObj[name] = 'Please enter New Password.'
          }
          break

        case 'passwordConfirmation':
          if (!value) {
            stateObj[name] = 'Please enter New Password Confirmation.'
          }
          break

        default:
          break
      }

      return stateObj
    })
  }

  return (
    <Layout>
      <SEO
        title={'Password'}
        defaultSEO={typeof seo !== 'undefined' && seo}
        webTitle={typeof seo !== 'undefined' && seo.Website_Title}
      />
      <div className="w-full flex flex-col">
        <Header
          user={user}
          notif={checkNotif}
          logo={seo.Logo.data.attributes.url}
          title={seo.Website_Title}
        />
        <div className="w-full mt-4 md:mt-6 xl:mt-8 text-center font-medium">
          <h2>Your Account</h2>
        </div>
      </div>
      <div className="mt-4 md:mt-6 xl:mt-8 pb-12 grow border-t bg-gray-50">
        <div className="w-full flex flex-col pt-8 pb-8">
          <div className="setflex-center-row space-x-8">
            <FancyLink
              destination="/account"
              className="pb-2 text-yellow-500 text-xl font-medium"
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
              className="border-b border-yellow-500 pb-2 text-yellow-500 text-xl font-medium"
            >
              Password
            </FancyLink>
          </div>
          <div className="flex flex-col max-w-md w-full mx-auto px-12 mt-12">
            {showMessage ? (
              showMessage.type === 'update' ? (
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
            <div className="flex flex-col">
              <span className="text-xl font-medium">
                Change the password for your account
              </span>
              <form method="post" onSubmit={doPassword} className="mt-6">
                <div className="flex flex-col">
                  <div className="h-full w-full flex flex-col">
                    <label className="font-medium">Current password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      onChange={setValue}
                      onBlur={validateInput}
                      className="w-full h-11 border p-2 mt-2"
                    />
                    {error.currentPassword && (
                      <span className="block text-red-500">
                        {error.currentPassword}
                      </span>
                    )}
                  </div>
                  <div className="h-full w-full mt-6 flex flex-col">
                    <label className="font-medium">New password</label>
                    <input
                      type="password"
                      name="password"
                      onChange={setValue}
                      onBlur={validateInput}
                      className="w-full h-11 border p-2 mt-2"
                    />
                    {error.newPassword && (
                      <span className="block text-red-500">
                        {error.newPassword}
                      </span>
                    )}
                  </div>
                  <div className="h-full w-full mt-6 flex flex-col">
                    <label className="font-medium">
                      New password confirmation
                    </label>
                    <input
                      type="password"
                      name="passwordConfirmation"
                      onChange={setValue}
                      onBlur={validateInput}
                      className="w-full h-11 border p-2 mt-2"
                    />
                    {error.passwordConfirmation && (
                      <span className="block text-red-500">
                        {error.passwordConfirmation}
                      </span>
                    )}
                  </div>
                </div>
                <FancyLink className="bg-yellow-400 w-full mt-6 text-white font-medium py-2 px-3">
                  Change my password
                </FancyLink>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer seo={seo} />
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx)

  if (!cookies.token) {
    return {
      redirect: {
        destination: '/login',
      },
    }
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
    props: {
      seo: seo.data.attributes,
      token: cookies.token,
      user: user.data,
      checkNotif: checkNotif.data.length === all.length ? false : true,
    },
  }
}

export default Password
