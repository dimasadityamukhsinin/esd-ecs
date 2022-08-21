import { useRef, useEffect } from 'react'
import Layout from '@/components/modules/layout'
import Container from '@/components/modules/container'
import Header from '@/components/modules/header'
import FancyLink from '@/components/utils/fancyLink'
import Image from 'next/image'
import SEO from '@/components/utils/seo'
import nookies from 'nookies'
import axios from 'axios'

export default function Completed({ seo, user, token, checkNotif }) {
  return (
    <Layout>
      <SEO
        title={'Completed'}
        defaultSEO={typeof seo !== 'undefined' && seo}
        webTitle={typeof seo !== 'undefined' && seo.Website_Title}
      />
      <Header user={user} notif={checkNotif} />
      <div className="w-full mt-4 md:mt-6 xl:mt-8 text-center font-medium">
        <h2>Your Learning</h2>
      </div>
      <Container className="mt-4 md:mt-6 xl:mt-8 border-t bg-gray-50">
        <div className="flex space-x-8 mt-12 ml-[0.7rem]">
          <FancyLink
            destination="/"
            className="pb-2 text-yellow-500 text-xl font-medium"
          >
            Assignment
          </FancyLink>
          <FancyLink
            destination="/missed"
            className="pb-2 text-yellow-500 text-xl font-medium"
          >
            Missed
          </FancyLink>
          <FancyLink
            destination="/completed"
            className="border-b border-yellow-500 pb-2 text-yellow-500 text-xl font-medium"
          >
            Completed
          </FancyLink>
        </div>
        <div className="flex flex-wrap test mt-6">
          <FancyLink className="relative bg-white border w-96">
            <span className="absolute top-0 right-0 z-20 mt-2 mr-3 text-white font-medium">
              80 / 100
            </span>
            <div className="relative flex justify-center w-full h-40">
              <Image src="/tes.jpg" layout="fill" objectFit="cover" />
              <div className="absolute z-10 w-full h-full bg-black opacity-40" />
              <hr className="absolute bottom-0 z-20 mb-3 w-11/12 px-4 bg-white" />
            </div>
            <div className="w-full flex flex-col p-3 space-y-3">
              <span className="font-medium text-lg text-left">
                Reducing Computer Power Consumption
              </span>
              <p className="text-gray-500 font-medium text-sm text-left">
                An imperative sentence is basically, a sentence that gives a
                command or gives a request to do something. You can use
                imperative sentences to give a command or instruction, ask for
                something, or give advice. They tell people what to do.
              </p>
              <div className="bg-yellow-400 w-full mt-6 text-white font-medium py-2 px-3">
                Go to modul
              </div>
            </div>
          </FancyLink>
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

  return {
    props: {
      seo: seo.data.data.attributes,
      token: cookies.token,
      user: user.data,
      checkNotif: checkNotif.data.length === all.length ? false : true,
    },
  }
}
