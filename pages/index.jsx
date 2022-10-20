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
import { IoNotificationsOutline } from 'react-icons/io5'
import parse from 'html-react-parser'

export default function Home({ user, home, seo }) {
  return (
    <Layout>
      <div className="w-full flex flex-col">
        <header className={`relative py-6 border-b w-full z-20`}>
          <Container className="flex flex-col">
            <div className="flex justify-end">
              <nav className="flex items-center space-x-5">
                {user && (
                  <FancyLink
                    destination="/notifications"
                    className="relative w-full h-full"
                  >
                    <IoNotificationsOutline size={23} />
                    {/* {notif && (
                    <div className="absolute top-0 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )} */}
                  </FancyLink>
                )}

                {user ? (
                  <div className="relative">
                    <FancyLink
                      onClick={() =>
                        setReveal({
                          option: 'profile',
                          status: !reveal.status,
                        })
                      }
                      className="bg-green-400 py-2 px-3 w-10 font-medium text-white"
                    >
                      {user.Full_Name.split('')[0]}
                    </FancyLink>
                    <div
                      className={`absolute w-36 right-0 top-12 flex flex-col items-center space-y-3 p-6 text-sm bg-white border shadow-[0_1px_5px_1px_rgb(0_0_0_/_5%)] ${
                        reveal.status ? 'block' : 'hidden'
                      }`}
                    >
                      <FancyLink
                        destination="/account"
                        className="font-medium text-green-500"
                      >
                        Account
                      </FancyLink>
                      <FancyLink
                        onClick={logout}
                        className="font-medium text-green-500"
                      >
                        Sign out
                      </FancyLink>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <FancyLink
                      destination="/login"
                      className="bg-green-400 py-2 px-3 w-10 font-medium text-white"
                    >
                      Login
                    </FancyLink>
                  </div>
                )}
              </nav>
            </div>
          </Container>
        </header>
      </div>
      <div className={`border-t w-full min-h-[60vh] grow`}>
        <Container className="w-full h-screen flex gap-10">
          <div className="w-full h-full flex items-center">
            <p className="text-blue-900 text-5xl max-w-2xl font-semibold leading-relaxed">
              {home.content1}
            </p>
          </div>
          <div className="relative w-full h-full max-h-96 m-auto">
            <Image
              src={seo.Logo.data.attributes.url}
              alt={seo.Website_Title}
              layout="fill"
              objectFit="contain"
            />
          </div>
        </Container>
        <div className="w-full h-auto py-7 bg-blue-900 flex justify-center">
          <span className="text-white font-semibold text-4xl ">
            {home.content2}
          </span>
        </div>
        <Container className="w-full min-h-screen flex gap-10">
          <div className="w-full h-full py-16 flex flex-col justify-between">
            <span className="max-w-fit text-lg font-semibold border-b-2 border-blue-900 pb-1 mb-14">
              {home.content3.left_content.title}
            </span>
            <div className="h-full text-blue-900 about font-medium">
              {parse(home.content3.left_content.description)}
            </div>
          </div>
          <div className="w-full h-full py-16 flex flex-col justify-between">
            <span className="max-w-fit text-lg font-semibold border-b-2 border-blue-900 pb-1 mb-14">
              {home.content3.right_content.title}
            </span>
            <div className="h-full text-blue-900 about font-medium">
              {parse(home.content3.right_content.description)}
            </div>
          </div>
        </Container>
        <Container className="w-full min-h-[400px] py-16 bg-blue-900 flex gap-10">
          <div className="relative w-full h-auto">
            <Image
              src={home.content4.left_content.image.data.attributes.url}
              alt={home.content4.left_content.image.data.alternativeText}
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className="w-full h-full flex flex-col justify-between">
            <span className="max-w-fit text-lg font-semibold text-white border-b-2 border-white pb-1 mb-14">
              {home.content4.right_content.title}
            </span>
            <div className="h-full text-white about font-medium">
              {parse(home.content4.right_content.description)}
            </div>
          </div>
        </Container>
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ ctx }) {
  const cookies = nookies.get(ctx)

  const reqSeo = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/setting?populate=deep`,
  )
  const seo = await reqSeo.json()

  const home = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/home?populate=deep`,
  )

  if (cookies.token) {
    const user = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
      {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      },
    )

    return {
      props: {
        user: user.data,
        seo: seo.data.attributes,
        home: home.data.data.attributes,
      },
    }
  } else {
    return {
      props: {
        user: null,
        seo: seo.data.attributes,
        home: home.data.data.attributes,
      },
    }
  }
}
