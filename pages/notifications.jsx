import Container from '@/components/modules/container'
import Header from '@/components/modules/header'
import Layout from '@/components/modules/layout'
import FancyLink from '@/components/utils/fancyLink'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import axios from 'axios'
import nookies from 'nookies'
import { useState } from 'react'
import { useRouter } from 'next/router'
import SEO from '@/components/utils/seo'
import Footer from '@/components/modules/footer'

export default function Notifications({
  user,
  seo,
  notifAll,
  notifDetail,
  token,
  checkNotif,
}) {
  const router = useRouter()
  const notif = [
    ...notifAll,
    ...notifDetail.filter((data) => data.attributes.All === false),
  ]

  const doRead = async (data) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${data.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            Read: [
              ...data.attributes.Read,
              {
                idUser: user.id,
                User: user.Full_Name,
              },
            ],
          },
        }),
      },
    )

    router.reload(window.location.pathname)
  }

  return (
    <Layout>
      <SEO
        title={'Notifications'}
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
      </div>
      <Container className="h-full lg:pb-12 row-span-5 grow">
        <div className="w-full mt-4 md:mt-6 xl:mt-8 text-center font-medium">
          <h2>Notifications</h2>
        </div>
        <div className="w-full max-w-3xl flex flex-col items-center mx-auto">
          <div className="w-full flex flex-col mt-12 space-y-12">
            {notif.map((data, id) => (
              <div
                key={id}
                className="w-full min-h-[50px] flex flex-col justify-between border-b pb-4"
              >
                <div className="w-full flex justify-between">
                  <AiOutlineQuestionCircle size={25} />
                  <p className="w-full px-2">{data.attributes.Content}</p>
                  <span className="w-24 text-gray-500">{`${new Date(
                    data.attributes.publishedAt,
                  ).getFullYear()}-${
                    new Date(data.attributes.publishedAt).getMonth() + 1
                  }-${new Date(data.attributes.publishedAt).getDate()}`}</span>
                </div>
                <div className="flex justify-end">
                  {!data.attributes.Read.find(
                    (data) => data.idUser === user.id.toString(),
                  ) && (
                    <FancyLink
                      onClick={() => doRead(data)}
                      className="text-blue-800 font-medium"
                    >
                      Mark as read
                    </FancyLink>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
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
      user: user.data,
      seo: seo.data.attributes,
      notifAll: notifAll.data,
      notifDetail: notifDetail.data,
      token: cookies.token,
      checkNotif: checkNotif.data.length === all.length ? false : true,
    },
  }
}
