import Container from '@/components/modules/container'
import Header from '@/components/modules/header'
import Layout from '@/components/modules/layout'
import FancyLink from '@/components/utils/fancyLink'
import { BsCheck2Square } from 'react-icons/bs'
import { BiConversation } from 'react-icons/bi'
import nookies from 'nookies'
import axios from 'axios'
import { useState } from 'react'
import SEO from '@/components/utils/seo'

export default function Conversations({
  user,
  userList,
  seo,
  modul,
  comments,
  modulId,
  token,
  checkNotif,
}) {
  const [field, setField] = useState({})
  const [progress, setProgress] = useState(false)
  const [dataComments, setComments] = useState(comments)

  const setValue = (e) => {
    const target = e.target
    const name = target.name
    const value = target.value

    setField({
      ...field,
      [name]: value,
    })
  }

  const doComment = async (e) => {
    e.preventDefault()
    setProgress(true)

    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          ...field,
          users_permissions_user: user.id,
          idUser: user.id,
          idModul: modulId,
          Modul_Name: modul.Title,
          User: user.Full_Name,
        },
      }),
    })
    const res = await req.json()

    const newComment = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/comments?filters[idModul][$eq]=${modulId}&populate=deep`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    setComments(newComment.data.data)

    setField({})
    e.target.reset()

    setProgress(false)
  }

  return (
    <Layout>
      <SEO
        title="Conversations"
        defaultSEO={typeof seo !== 'undefined' && seo}
        webTitle={typeof seo !== 'undefined' && seo.Website_Title}
      />
      <Header user={user} notif={checkNotif} />
      <div className="setflex-center-row border-b py-6 space-x-8">
        <FancyLink destination="/" className="font-medium flex items-center">
          <BsCheck2Square size={20} className="mr-2" />
          Assignment
        </FancyLink>
        <FancyLink
          destination="/conversations"
          className="font-medium flex items-center"
        >
          <BiConversation size={20} className="mr-2" />
          Conversations
        </FancyLink>
      </div>
      <Container className="mt-4 md:mt-6 xl:mt-8">
        <div className="w-full my-12 max-w-3xl flex flex-col mx-auto">
          <span className="text-2xl font-medium">{modul.Title}</span>
          <span className="mt-2">
            View and write a new comment from{' '}
            <span className="font-medium text-yellow-500">{modul.Title}</span>{' '}
            Modul
          </span>
          <div className="border-b w-full mt-6 pb-2">
            <span className="font-medium border-b border-black pb-2.5">
              Comments
            </span>
          </div>
          <div className="w-full min-h-[10rem] flex mt-10 font-medium">
            <span className="h-[fit-content] w-10 py-2 px-3 mr-5 text-white bg-yellow-400">
              {user.Full_Name.split('')[0]}
            </span>
            <div className="w-full flex flex-col">
              <span className="mb-2">{user.Full_Name}</span>
              <form
                method="post"
                onSubmit={doComment}
                className="relative w-full h-full"
              >
                {progress && (
                  <div className="absolute inset-0 z-10 bg-white/50" />
                )}
                <textarea
                  onChange={setValue}
                  name="Content"
                  className="w-full font-normal"
                ></textarea>
                <button
                  type="submit"
                  className="w-fit mt-3 flex items-center font-medium text-white bg-yellow-400 py-2 px-3"
                >
                  Post
                </button>
              </form>
            </div>
          </div>
          <div className="flex flex-col w-full space-y-6">
            {dataComments.map((data) => (
              <div className="w-full border-b pb-6 flex mt-10">
                <span className="h-[fit-content] w-10 py-2 px-3 mr-5 text-white bg-yellow-400 font-medium">
                  {
                    userList
                      .find(
                        (item) => item.id.toString() === data.attributes.idUser,
                      )
                      .Full_Name.split('')[0]
                  }
                </span>
                <div className="w-full flex flex-col">
                  <div className="flex justify-between">
                    <span className="mb-2 font-medium">
                      {
                        userList.find(
                          (item) =>
                            item.id.toString() === data.attributes.idUser,
                        ).Full_Name
                      }
                    </span>
                    <span className="text-gray-500">
                      {`${new Date(
                        data.attributes.publishedAt,
                      ).getFullYear()}-${
                        new Date(data.attributes.publishedAt).getMonth() + 1
                      }-${new Date(data.attributes.publishedAt).getDate()}`}
                    </span>
                  </div>
                  <div className="w-full h-full">
                    <p>{data.attributes.Content}</p>
                  </div>
                </div>
              </div>
            ))}
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

  const user = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
    {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    },
  )

  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/moduls?filters[slug][$eq]=${ctx.params.slug}&populate=deep`,
  )
  const res = await req.json()

  if (res.data[0].attributes.major.data?.attributes.Name) {
    if (
      !res.data[0].attributes.major.data?.attributes.Name ===
      user.data.major.Name
    ) {
      return {
        notFound: true,
      }
    }
  } else {
    return {
      notFound: true,
    }
  }

  const userList = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
    {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    },
  )

  const comments = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/comments?filters[idModul][$eq]=${res.data[0].id}&populate=deep`,
    {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    },
  )

  const reqSeo = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/setting?populate=deep`,
  )
  const seo = await reqSeo.json()

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
      userList: userList.data,
      seo: seo.data.attributes,
      modul: res.data[0].attributes,
      comments: comments.data.data,
      modulId: res.data[0].id,
      token: cookies.token,
      checkNotif: checkNotif.data.length === all.length ? false : true,
    },
  }
}
