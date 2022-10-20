import Container from '@/components/modules/container'
import Header from '@/components/modules/header'
import Layout from '@/components/modules/layout'
import FancyLink from '@/components/utils/fancyLink'
import { BsCheck2Square, BsReply } from 'react-icons/bs'
import { BiConversation } from 'react-icons/bi'
import nookies from 'nookies'
import axios from 'axios'
import { useState } from 'react'
import SEO from '@/components/utils/seo'
import Footer from '@/components/modules/footer'
import { AiOutlineLike, AiFillLike } from 'react-icons/ai'

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
  const [fieldComment, setFieldComment] = useState({})
  const [fieldCommentReply, setFieldCommentReply] = useState({})
  const [progress, setProgress] = useState(false)
  const [progressReply, setProgressReply] = useState(false)
  const [dataComments, setComments] = useState(comments)
  const [reply, setReply] = useState([false, 0])

  const setValueComment = (e) => {
    const target = e.target
    const name = target.name
    const value = target.value

    setFieldComment({
      ...fieldComment,
      [name]: value,
    })
  }

  const setValueCommentReply = (e) => {
    const target = e.target
    const name = target.name
    const value = target.value

    setFieldCommentReply({
      ...fieldComment,
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
          ...fieldComment,
          users_permissions_user: user.id,
          idUser: user.id,
          idModule: modulId,
          Module_Name: modul.Title,
          User: user.Full_Name,
        },
      }),
    })
    const res = await req.json()

    const newComment = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/comments?filters[idModule][$eq]=${modulId}&populate=deep`,
    )

    setComments(newComment.data.data)

    setFieldComment({})
    e.target.reset()

    setProgress(false)
  }

  const doReply = async (e, id) => {
    e.preventDefault()
    setProgressReply(true)

    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${id}?populate=deep`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(({ data }) => {
        let date = new Date()
        let dd = String(date.getDate()).padStart(2, '0')
        let mm = String(date.getMonth() + 1).padStart(2, '0') //January is 0!
        let yyyy = date.getFullYear()

        date = yyyy + '-' + mm + '-' + dd
        axios
          .put(
            `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${id}`,
            {
              data: {
                Reply: [
                  ...data.data.attributes.Reply,
                  {
                    ...fieldCommentReply,
                    idUser: user.id,
                    Date: date,
                  },
                ],
              },
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(() => {
            axios
              .get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/comments?filters[idModule][$eq]=${modulId}&populate=deep`,
              )
              .then(({ data }) => {
                setComments(data.data)
              })

            setFieldCommentReply({})
            e.target.reset()

            setProgressReply(false)
          })
      })
  }

  const doLike = (id) => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${id}?populate=deep`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(({ data }) => {
        axios
          .put(
            `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${id}`,
            {
              data: {
                Liked: data.data.attributes.Liked
                  ? parseInt(data.data.attributes.Liked) + 1
                  : 1,
                Liked_User: [
                  ...data.data.attributes.Liked_User,
                  {
                    idUser: user.id,
                  },
                ],
              },
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(() => {
            axios
              .get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/comments?filters[idModule][$eq]=${modulId}&populate=deep`,
              )
              .then(({ data }) => {
                setComments(data.data)
              })
          })
      })
  }

  const doLikeReply = (id, dataReply) => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${id}?populate=deep`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(({ data }) => {
        axios
          .put(
            `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${id}`,
            {
              data: {
                Reply: [
                  ...data.data.attributes.Reply.map((item) => {
                    if (item.id === dataReply.id) {
                      return {
                        ...item,
                        Liked: dataReply.Liked
                          ? parseInt(dataReply.Liked) + 1
                          : 1,
                        Liked_User: [
                          ...dataReply.Liked_User,
                          {
                            idUser: user.id,
                          },
                        ],
                      }
                    } else {
                      return item
                    }
                  }),
                ],
              },
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(() => {
            axios
              .get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/comments?filters[idModule][$eq]=${modulId}&populate=deep`,
              )
              .then(({ data }) => {
                setComments(data.data)
              })
          })
      })
  }

  const doRemoveLike = (id) => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${id}?populate=deep`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(({ data }) => {
        axios
          .put(
            `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${id}`,
            {
              data: {
                Liked: parseInt(data.data.attributes.Liked) - 1,
                Liked_User: [
                  ...data.data.attributes.Liked_User.filter(
                    (item) => parseInt(item.idUser) !== parseInt(user.id),
                  ),
                ],
              },
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(() => {
            axios
              .get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/comments?filters[idModule][$eq]=${modulId}&populate=deep`,
              )
              .then(({ data }) => {
                setComments(data.data)
              })
          })
      })
  }

  const doRemoveLikeReply = (id, dataReply) => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${id}?populate=deep`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(({ data }) => {
        axios
          .put(
            `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${id}`,
            {
              data: {
                Reply: [
                  ...data.data.attributes.Reply.map((item) => {
                    if (item.id === dataReply.id) {
                      return {
                        ...item,
                        Liked: parseInt(dataReply.Liked) - 1,
                        Liked_User: [
                          ...dataReply.Liked_User.filter(
                            (item) =>
                              parseInt(item.idUser) !== parseInt(user.id),
                          ),
                        ],
                      }
                    } else {
                      return item
                    }
                  }),
                ],
              },
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(() => {
            axios
              .get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/comments?filters[idModule][$eq]=${modulId}&populate=deep`,
              )
              .then(({ data }) => {
                setComments(data.data)
              })
          })
      })
  }

  return (
    <Layout>
      <SEO
        title="Conversations"
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
        <div className="setflex-center-row border-b py-6 space-x-8">
          <FancyLink destination="/your-learning" className="font-medium flex items-center">
            <BsCheck2Square size={20} className="mr-2" />
            Assignment
          </FancyLink>
          <FancyLink
            destination={`/your-learning/modul/${modul.Slug}/conversations`}
            className="font-medium flex items-center"
          >
            <BiConversation size={20} className="mr-2" />
            Conversations
          </FancyLink>
        </div>
      </div>
      <Container className="mt-4 md:mt-6 xl:mt-8 pb-12 min-h-[60vh] grow">
        <div className="w-full my-12 max-w-3xl flex flex-col mx-auto">
          <span className="text-2xl font-medium">{modul.Title}</span>
          <span className="mt-2">
            View and write a new comment from{' '}
            <span className="font-medium text-green-500">{modul.Title}</span>{' '}
            Module
          </span>
          <div className="border-b w-full mt-6 pb-2">
            <span className="font-medium border-b border-black pb-2.5">
              Comments
            </span>
          </div>
          <div className="w-full min-h-[10rem] flex mt-10 font-medium">
            <span className="h-[fit-content] w-10 py-2 px-3 mr-5 text-white bg-green-400">
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
                  onChange={setValueComment}
                  name="Content"
                  className="w-full font-normal"
                ></textarea>
                <button
                  type="submit"
                  className="w-fit mt-3 flex items-center font-medium text-white bg-green-400 py-2 px-3"
                >
                  Post
                </button>
              </form>
            </div>
          </div>
          <div className="flex flex-col w-full space-y-10">
              {dataComments.map((data, id) => (
                <div
                  key={id}
                  className="w-full border-b pb-3 flex flex-col space-y-5 mt-10"
                >
                  <div className="w-full flex">
                    <span className="h-[fit-content] w-10 py-2 px-3 mr-5 text-white bg-green-400 font-medium">
                      {
                        userList
                          .find(
                            (item) =>
                              item.id.toString() === data.attributes.idUser,
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
                  <div className="w-full flex pl-14 space-x-24">
                    {data.attributes.Liked_User.find(
                      (item) => parseInt(item.idUser) === user.id,
                    ) ? (
                      <FancyLink
                        onClick={() => doRemoveLike(data.id)}
                        className="text-green-500 flex items-center"
                      >
                        <AiFillLike size={22} className="mr-1" />
                        Liked{' '}
                        {data.attributes.Liked
                          ? parseInt(data.attributes.Liked) === 0
                            ? ''
                            : data.attributes.Liked
                          : ''}
                      </FancyLink>
                    ) : (
                      <FancyLink
                        onClick={() => doLike(data.id)}
                        className="text-green-500 flex items-center"
                      >
                        <AiOutlineLike size={22} className="mr-1" />
                        Like{' '}
                        {data.attributes.Liked
                          ? parseInt(data.attributes.Liked) === 0
                            ? ''
                            : data.attributes.Liked
                          : ''}
                      </FancyLink>
                    )}
                    <FancyLink
                      onClick={() => setReply([true, id])}
                      className="text-green-500 flex items-center"
                    >
                      <BsReply size={22} className="mr-1" />
                      Reply
                    </FancyLink>
                  </div>
                  {data.attributes.Reply.map((dataReply, idReply) => (
                    <div
                      key={idReply}
                      className="w-full pl-14 flex flex-col space-y-5 mt-12"
                    >
                      <div className="w-full flex">
                        <span className="h-[fit-content] w-10 py-2 px-3 mr-5 text-white bg-green-400 font-medium">
                          {
                            userList
                              .find(
                                (item) =>
                                  parseInt(item.id) ===
                                  parseInt(dataReply.idUser),
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
                                    item.id.toString() === dataReply.idUser,
                                ).Full_Name
                              }
                            </span>
                            <span className="text-gray-500">
                              {`${new Date(dataReply.Date).getFullYear()}-${
                                new Date(dataReply.Date).getMonth() + 1
                              }-${new Date(dataReply.Date).getDate()}`}
                            </span>
                          </div>
                          <div className="w-full h-full">
                            <p>{dataReply.Content}</p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex pl-14 space-x-24">
                        {dataReply.Liked_User.find(
                          (item) => parseInt(item.idUser) === user.id,
                        ) ? (
                          <FancyLink
                            onClick={() =>
                              doRemoveLikeReply(data.id, dataReply)
                            }
                            className="text-green-500 flex items-center"
                          >
                            <AiFillLike size={22} className="mr-1" />
                            Liked{' '}
                            {dataReply.Liked
                              ? parseInt(dataReply.Liked) === 0
                                ? ''
                                : dataReply.Liked
                              : ''}
                          </FancyLink>
                        ) : (
                          <FancyLink
                            onClick={() => doLikeReply(data.id, dataReply)}
                            className="text-green-500 flex items-center"
                          >
                            <AiOutlineLike size={22} className="mr-1" />
                            Like{' '}
                            {dataReply.Liked
                              ? parseInt(dataReply.Liked) === 0
                                ? ''
                                : dataReply.Liked
                              : ''}
                          </FancyLink>
                        )}
                      </div>
                    </div>
                  ))}
                  {reply[0] && reply[1] === id ? (
                    <div className="w-full min-h-[10rem] pl-14 flex mt-10 font-medium">
                      <span className="h-[fit-content] w-10 py-2 px-3 mr-5 text-white bg-green-400">
                        {user.Full_Name.split('')[0]}
                      </span>
                      <div className="w-full flex flex-col">
                        <span className="mb-2">{user.Full_Name}</span>
                        <form
                          method="post"
                          onSubmit={(e) => doReply(e, data.id)}
                          className="relative w-full h-full"
                        >
                          {progressReply && (
                            <div className="absolute inset-0 z-10 bg-white/50" />
                          )}
                          <textarea
                            onChange={setValueCommentReply}
                            name="Content"
                            className="w-full font-normal"
                          ></textarea>
                          <button
                            type="submit"
                            className="w-fit mt-3 flex items-center font-medium text-white bg-green-400 py-2 px-3"
                          >
                            Post
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
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
    `${process.env.NEXT_PUBLIC_API_URL}/api/users`
  )

  const comments = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/comments?filters[idModule][$eq]=${res.data[0].id}&populate=deep`
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
