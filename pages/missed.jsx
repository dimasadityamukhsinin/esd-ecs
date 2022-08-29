import { useRef, useEffect } from 'react'
import Layout from '@/components/modules/layout'
import Container from '@/components/modules/container'
import Header from '@/components/modules/header'
import FancyLink from '@/components/utils/fancyLink'
import Image from 'next/image'
import nookies from 'nookies'
import SEO from '@/components/utils/seo'
import axios from 'axios'
import { useRouter } from 'next/router'
import Footer from '@/components/modules/footer'

export default function Missed({ modul, seo, user, token, checkNotif }) {
  const router = useRouter()

  const countdownData = (date) => {
    let today = new Date().toISOString().slice(0, 10)

    const startDate = date
    const endDate = today

    const diffInMs = new Date(startDate) - new Date(endDate)
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
    return diffInDays
  }

  return (
    <Layout>
      <SEO
        title={'Missed'}
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
        <div className="w-full py-8 flex justify-center items-center h-full font-medium">
          <h2 className="m-0">Your Learning</h2>
        </div>
      </div>
      <div className={`border-t bg-gray-50 w-full min-h-[60vh] grow`}>
        <Container className="mt-4 md:mt-6 xl:mt-8 pb-12">
          <div className="flex space-x-8 mt-12 md:ml-[0.7rem] overflow-auto">
            <FancyLink
              destination="/"
              className="pb-2 text-yellow-500 text-xl font-medium"
            >
              Assignment
            </FancyLink>
            <FancyLink
              destination="/missed"
              className="border-b border-yellow-500 pb-2 text-yellow-500 text-xl font-medium"
            >
              Missed
            </FancyLink>
            <FancyLink
              destination="/completed"
              className="pb-2 text-yellow-500 text-xl font-medium"
            >
              Completed
            </FancyLink>
          </div>
          <div className="flex flex-wrap modul mt-6">
            {modul.map(({ attributes, status }, id) =>
              status !== 'completed' ? (
                countdownData(attributes.Assignment_Deadline) < 0 && (
                  <FancyLink
                    key={id}
                    className="relative bg-white border w-96 opacity-60 pointer-events-none"
                  >
                    <span className="absolute top-0 right-0 z-20 mt-2 mr-3 text-red-400 font-medium">
                      Missed
                    </span>
                    <div className="relative flex justify-center w-full h-52">
                      {attributes.Thumbnail && (
                        <Image
                          src={attributes.Thumbnail.data.attributes.url}
                          alt={attributes.title}
                          layout="fill"
                          objectFit="cover"
                        />
                      )}
                      <div className="absolute z-10 w-full h-full bg-black opacity-40" />
                      <hr className="absolute bottom-0 z-20 mb-3 w-11/12 px-4 bg-white" />
                    </div>
                    <div className="w-full flex items-start flex-col p-3 space-y-3">
                      <span className="font-medium text-gray-500">
                        Module {id + 1}
                      </span>
                      <span className="font-medium text-lg text-left">
                        {attributes.Title}
                      </span>
                      <p className="text-gray-500 font-medium text-sm text-left">
                        {attributes.Short_Description}
                      </p>
                      <div className="bg-yellow-400 w-full mt-6 text-center text-white font-medium py-2 px-3">
                        Go to module
                      </div>
                    </div>
                  </FancyLink>
                )
              ) : (
                <></>
              ),
            )}
          </div>
        </Container>
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

  const reqModul = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/moduls?populate=deep`,
  )
  const modul = await reqModul.json()

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

  const completed = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/completeds?filters[idUser][$eq]=${user.data.id}&populate=deep`,
  )

  modul.data = modul.data.map((item, id) => {
    return {
      ...item,
      status: completed.data.data.find(
        (data) =>
          parseInt(data.attributes.idModul) === parseInt(item.id) &&
          parseInt(data.attributes.idUser) === parseInt(user.data.id),
      )
        ? 'completed'
        : '',
    }
  })

  return {
    props: {
      modul: modul.data,
      seo: seo.data.data.attributes,
      token: cookies.token,
      user: user.data,
      checkNotif: checkNotif.data.length === all.length ? false : true,
    },
  }
}
