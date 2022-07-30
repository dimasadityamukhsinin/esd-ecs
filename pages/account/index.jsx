import Container from '@/components/modules/container'
import Header from '@/components/modules/header'
import Layout from '@/components/modules/layout'
import FancyLink from '@/components/utils/fancyLink'
import nookies from 'nookies'
import axios from 'axios'
import { useEffect, useState } from 'react'
import flash from 'next-flash'
import { useRouter } from 'next/router'

const Account = ({ user, token, flashData }) => {
  const router = useRouter()
  const [field, setField] = useState({
    username: user.username,
  })

  const setValue = (e) => {
    const target = e.target
    const name = target.name
    const value = target.value

    setField({
      ...field,
      [name]: value,
    })
  }

  const doUpdate = async (e) => {
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

    router.reload(window.location.pathname)
    flash.set(['update', 'You’ve updated your profile.'])
  }

  const ShowFlash = () => {
    useEffect(() => {
      flash.set(null)
    },[])
    return <>{flashData[1]}</>
  }

  return (
    <Layout>
      <Header />
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
              {flashData && (
                <div className="bg-green-500 text-white rounded mb-4 px-4 py-3">
                  <ShowFlash />
                </div>
              )}
              <span className="text-2xl font-medium">About you</span>
              <form method="post" onSubmit={doUpdate} className="mt-6">
                <div className="flex flex-col">
                  <div className="h-full w-full flex flex-col">
                    <label className="font-medium">Username *</label>
                    <input
                      type="text"
                      name="username"
                      onChange={setValue}
                      className="w-full h-11 border p-2 mt-2"
                      value={field.username}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-yellow-400 w-full mt-6 text-white font-medium py-2 px-3"
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
    return {
      redirect: {
        destination: '/login',
      },
    }
  }

  const user = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
    {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    },
  )

  return {
    token: cookies.token,
    user: user.data,
    flashData: flash.get(ctx),
  }
}

export default Account
