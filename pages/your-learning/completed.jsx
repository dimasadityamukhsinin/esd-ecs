import { useRef, useEffect } from 'react'
import Layout from '@/components/modules/layout'
import Container from '@/components/modules/container'
import Header from '@/components/modules/header'
import FancyLink from '@/components/utils/fancyLink'
import Image from 'next/image'
import SEO from '@/components/utils/seo'
import nookies from 'nookies'
import axios from 'axios'
import Footer from '@/components/modules/footer'

export default function Completed({ seo, user, token, modul, checkNotif }) {
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
        title={'Completed'}
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
        <div className="w-full py-4 lg:py-8 flex justify-center items-center h-full font-medium">
          <h2>Your Learning</h2>
        </div>
      </div>
      <div className={`border-t bg-gray-50 w-full min-h-[60vh] grow`}>
        <Container className="mt-4 md:mt-6 xl:mt-8 pb-12">
          <div className="flex space-x-8 mt-12 md:ml-[0.7rem] overflow-auto">
            <FancyLink
              destination="/your-learning"
              className="pb-2 text-green-500 text-xl font-medium"
            >
              Assignment
            </FancyLink>
            <FancyLink
              destination="/your-learning/missed"
              className="pb-2 text-green-500 text-xl font-medium"
            >
              Missed
            </FancyLink>
            <FancyLink
              destination="/your-learning/completed"
              className="border-b border-green-500 pb-2 text-green-500 text-xl font-medium"
            >
              Completed
            </FancyLink>
          </div>
          <div className="flex flex-wrap modul mt-6">
            {modul.map(({ attributes, Total_Score, status }, id) =>
              status === 'completed' ? (
                // countdownData(attributes.Assignment_Deadline) < 0 ? (
                <div
                  key={id}
                  // destination={`/modul/${attributes.Slug}/completed`}
                  className="relative bg-white border"
                >
                  <div className="absolute left-0 top-0 w-full h-full bg-gray-500 z-30 opacity-70" />
                  <span className="absolute top-0 right-0 z-20 mt-2 mr-3 text-white font-medium">
                    {`${
                      Number.isInteger(Total_Score)
                        ? Total_Score
                        : parseFloat(Total_Score).toFixed(2)
                    } / 100`}
                  </span>
                  <div className="relative flex justify-center w-full h-52">
                    {attributes.Thumbnail && (
                      <Image
                        src={attributes.Thumbnail.data.attributes.url}
                        alt={attributes.title}
                        layout="fill"
                        objectFit="contain"
                      />
                    )}
                    <div className="absolute z-10 w-full h-full bg-black opacity-40" />
                    <hr className="absolute bottom-0 z-20 mb-3 w-11/12 px-4 bg-white" />
                  </div>
                  <div className="w-full flex flex-col justify-between p-3 space-y-3">
                    <div className="flex flex-col  space-y-3">
                      <span className="font-medium text-gray-500">
                        Module {id + 1}
                      </span>
                      <span className="font-medium text-lg text-left">
                        {attributes.Title}
                      </span>
                      <p className="text-gray-500 font-medium text-sm text-left">
                        {attributes.Short_Description}
                      </p>
                    </div>
                    <div className="bg-green-400 w-full mt-6 text-center text-white font-medium py-2 px-3">
                      Go to module
                    </div>
                  </div>
                </div>
              ) : (
                // ) : (
                //   <div key={id} className="relative bg-white border">
                //     <div className="absolute left-0 top-0 w-full h-full bg-gray-500 z-30 opacity-70" />
                //     <div className="absolute left-0 top-0 w-full h-full flex justify-center z-40 items-center">
                //       <span className="text-white font-medium text-xl text-center">
                //         {`${countdownData(
                //           attributes.Assignment_Deadline,
                //         )} days left`}
                //         <br />
                //         to check the assignment
                //       </span>
                //     </div>
                //     <div>
                //       <span className="absolute top-0 right-0 z-20 mt-2 mr-3 text-white font-medium">
                //         {`${
                //           Number.isInteger(Total_Score)
                //             ? Total_Score
                //             : parseFloat(Total_Score).toFixed(2)
                //         } / 100`}
                //       </span>
                //       <div className="relative flex justify-center w-full h-52">
                //         {attributes.Thumbnail && (
                //           <Image
                //             src={attributes.Thumbnail.data.attributes.url}
                //             alt={attributes.title}
                //             layout="fill"
                //             objectFit="cover"
                //           />
                //         )}
                //         <div className="absolute z-10 w-full h-full bg-black opacity-40" />
                //         <hr className="absolute bottom-0 z-20 mb-3 w-11/12 px-4 bg-white" />
                //       </div>
                //       <div className="w-full flex flex-col justify-between p-3 space-y-3">
                //         <div className="flex flex-col  space-y-3">
                //           <span className="font-medium text-gray-500">
                //             Module {id + 1}
                //           </span>
                //           <span className="font-medium text-lg text-left">
                //             {attributes.Title}
                //           </span>
                //           <p className="text-gray-500 font-medium text-sm text-left">
                //             {attributes.Short_Description}
                //           </p>
                //         </div>
                //         <div className="bg-yellow-400 w-full mt-6 text-center text-white font-medium py-2 px-3">
                //           Go to module
                //         </div>
                //       </div>
                //     </div>
                //   </div>
                // )
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

  const reqModul = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/moduls?filters[major][Name][$eq]=${user.data.major?.Name}&populate=deep`,
  )
  const modul = await reqModul.json()

  const completed = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/completeds?filters[idUser][$eq]=${user.data.id}&populate=deep`,
  )

  modul.data = modul.data.map((item, id) => {
    return {
      ...item,
      Total_Score: completed.data.data.find(
        (data) =>
          parseInt(data.attributes.idModule) === parseInt(item.id) &&
          parseInt(data.attributes.idUser) === parseInt(user.data.id),
      )
        ? completed.data.data.find(
            (data) =>
              parseInt(data.attributes.idModule) === parseInt(item.id) &&
              parseInt(data.attributes.idUser) === parseInt(user.data.id),
          ).attributes.Total_Score
        : 0,
      status: completed.data.data.find(
        (data) =>
          parseInt(data.attributes.idModule) === parseInt(item.id) &&
          parseInt(data.attributes.idUser) === parseInt(user.data.id),
      )
        ? 'completed'
        : '',
    }
  })

  return {
    props: {
      seo: seo.data.data.attributes,
      token: cookies.token,
      user: user.data,
      modul: modul.data,
      checkNotif: checkNotif.data.length === all.length ? false : true,
    },
  }
}