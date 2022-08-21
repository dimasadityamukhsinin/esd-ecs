import Container from '@/components/modules/container'
import Header from '@/components/modules/header'
import Layout from '@/components/modules/layout'
import FancyLink from '@/components/utils/fancyLink'
import nookies from 'nookies'
import axios from 'axios'
import flash from 'next-flash'
import SEO from '@/components/utils/seo'

const Password = ({ seo, token, user, flashData, checkNotif }) => {
  return (
    <Layout>
      <SEO
        title={'Password'}
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
            <div className="flex flex-col">
              <span className="text-xl font-medium">
                Change the password for your account
              </span>
              <form className="mt-6">
                <div className="flex flex-col">
                  <div className="h-full w-full flex flex-col">
                    <label className="font-medium">Current password</label>
                    <input
                      type="text"
                      name="currentPassword"
                      className="w-full h-11 border p-2 mt-2"
                    />
                  </div>
                  <div className="h-full w-full mt-6 flex flex-col">
                    <label className="font-medium">
                      Enter a new password (min. 8 characters)
                    </label>
                    <input
                      type="text"
                      name="newPassword"
                      className="w-full h-11 border p-2 mt-2"
                    />
                  </div>
                </div>
                <FancyLink className="bg-yellow-400 w-full mt-6 text-white font-medium py-2 px-3">
                  Change my password
                </FancyLink>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  )
}

Password.getInitialProps = async (ctx) => {
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
    seo: seo.data.attributes,
    token: cookies.token,
    user: user.data,
    flashData: flash.get(ctx),
    checkNotif: checkNotif.data.length === all.length ? false : true,
  }
}

export default Password
