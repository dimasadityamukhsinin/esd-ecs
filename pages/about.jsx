import Container from '@/components/modules/container'
import Header from '@/components/modules/header'
import Layout from '@/components/modules/layout'
import nookies from 'nookies'
import axios from 'axios'
import parse from 'html-react-parser'
import SEO from '@/components/utils/seo'

const About = ({ seo, about, user, token, checkNotif }) => {
  return (
    <Layout>
      <SEO
        title={'About'}
        defaultSEO={typeof seo !== 'undefined' && seo}
        webTitle={typeof seo !== 'undefined' && seo.Website_Title}
      />
      <Header user={user} notif={checkNotif} />
      <Container className="mt-4 md:mt-6 xl:mt-8">
        <div className="w-full max-w-lg mx-auto flex flex-col pt-8 pb-8">
          <h2 className="text-lg m-0 font-medium">About {seo.Website_Title}</h2>
          <h1 className="text-4xl font-medium">Our Story</h1>
          <div className="w-full flex flex-col mt-8 about font-medium">
            {parse(about.Content)}
          </div>
        </div>
      </Container>
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

  const seo = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/setting?populate=deep`,
  )

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

  const about = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/about`)

  return {
    props: {
      seo: seo.data.data.attributes,
      about: about.data.data.attributes,
      token: cookies.token,
      user: user.data,
      checkNotif: checkNotif.data.length === all.length ? false : true,
    },
  }
}

export default About
