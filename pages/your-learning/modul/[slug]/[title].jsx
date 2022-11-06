import Container from '@/components/modules/container'
import TitleComponent from '@/components/modules/editorial/titleComponent'
import YoutubeComponent from '@/components/modules/editorial/youtubeComponent'
import Header from '@/components/modules/header'
import Layout from '@/components/modules/layout'
import FancyLink from '@/components/utils/fancyLink'
import { useRef, useState } from 'react'
import { BsCheck2, BsCheck2Square, BsReply } from 'react-icons/bs'
import { BiConversation } from 'react-icons/bi'
import { GrNext, GrPrevious } from 'react-icons/gr'
import { AiOutlineLike, AiFillLike } from 'react-icons/ai'
import swal from 'sweetalert'
import DragDrop from '@/components/dnd/DragDrop'
import SEO from '@/components/utils/seo'
import nookies from 'nookies'
import axios from 'axios'
import StackDrag from '@/components/dnd/StackDrag'
import { useEffect } from 'react'
import { scrollToTop } from '@/components/utils/scrollToTop'
import Footer from '@/components/modules/footer'
import { useRouter } from 'next/router'
import StackDragDrop from '@/components/dnd/StackDragDrop'
import FillLeftAnswer from '@/components/modulComponent/fillLeftAnswer'
import FillRightAnswer from '@/components/modulComponent/fillRightAnswer'
import Arrange from '@/components/modulComponent/arrange'
import Essay from '@/components/modulComponent/essay'

export default function ModulBasedTitle({
  user,
  userList,
  modul,
  modulEditor,
  modulList,
  modulCompleted,
  seo,
  comments,
  modulId,
  token,
  checkNotif,
}) {
  const ref = useRef()
  const route = useRouter()
  const [reply, setReply] = useState([false, 0])
  const [fieldComment, setFieldComment] = useState({})
  const [fieldCommentReply, setFieldCommentReply] = useState({})
  const [progress, setProgress] = useState(false)
  const [progressReply, setProgressReply] = useState(false)
  const [dataComments, setComments] = useState(comments)

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

  const doAnswer = async (e) => {
    swal({
      title: 'Have you finished your assignment?',
      icon: 'warning',
      buttons: true,
      // dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        if (modulCompleted) {
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/completeds/${modulCompleted.id}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                data: {
                  finish: true,
                },
              }),
            },
          ).then(() => {
            swal('Congratulations, your assignment has been completed!', {
              icon: 'success',
            })
            setTimeout(() => {
              route.replace('/your-learning')
            }, 50)
          })
        } else {
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/completeds`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              data: {
                finish: true,
              },
            }),
          }).then(() => {
            swal('Congratulations, your assignment has been completed!', {
              icon: 'success',
            })
            setTimeout(() => {
              route.replace('/your-learning')
            }, 50)
          })
        }
      }
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

  useEffect(() => {
    scrollToTop()
  }, [])

  return (
    <Layout>
      <SEO
        title={modul.Title}
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
          <FancyLink
            destination="/your-learning"
            className="font-medium flex items-center"
          >
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
      <div className="w-full h-screen grid grid-cols-4 grow">
        <div className="w-full h-full flex flex-col items-start gap-6 p-6 col-span-1 border-r overflow-y-auto">
          {modul.Editor?.map(
            (data, id) =>
              data.__component === 'editor.title' && (
                <FancyLink
                  key={id}
                  destination={`/your-learning/modul/${modul.Slug}/${data.id}`}
                  className="flex flex-col items-start text-left gap-2"
                >
                  <span className="font-semibold">
                    {data.Title}. {data.Content}
                  </span>
                  <p className="pl-4">{data.description}</p>
                </FancyLink>
              ),
          )}
        </div>
        <div className="relative col-span-3 flex flex-col w-full pb-12 grow overflow-y-auto">
          <Container className="mt-4 md:mt-6 xl:mt-8">
            <div
              ref={ref}
              className="w-full max-w-4xl flex flex-col items-center mx-auto space-y-8"
            >
              {modulEditor?.map((data, idComponent) =>
                data.__component === 'editor.title' ? (
                  <TitleComponent
                    title={data.Title}
                    content={data.Content}
                    key={idComponent}
                  />
                ) : data.__component === 'editor.youtube' ? (
                  <YoutubeComponent link={data.Youtube} key={idComponent} />
                ) : data.__component === 'editor.content' ? (
                  <div
                    key={idComponent}
                    data-id={idComponent + 1}
                    className="w-full flex flex-col space-y-3 editor"
                    dangerouslySetInnerHTML={{ __html: data.Content }}
                  ></div>
                ) : data.type === 'drag-drop' ? (
                  <div className="flex flex-col w-full" key={idComponent}>
                    <DragDrop
                      assessment={modulEditor[0].assessment}
                      modulCompleted={modulCompleted}
                      modulId={modulId}
                      modul={modul}
                      user={user}
                      token={token}
                      dragDrop={data}
                      idComponent={idComponent}
                    />
                  </div>
                ) : data.type === 'fill-left-answer' ? (
                  <FillLeftAnswer
                    fill={data}
                    modulCompleted={modulCompleted}
                    token={token}
                    user={user}
                    assessment={modulEditor[0].assessment}
                  />
                ) : data.type === 'fill-right-answer' ? (
                  <FillRightAnswer
                    fill={data}
                    modulCompleted={modulCompleted}
                    token={token}
                    user={user}
                    assessment={modulEditor[0].assessment}
                  />
                ) : data.type === 'arrange' ? (
                  <Arrange
                    arrange={data}
                    modulCompleted={modulCompleted}
                    token={token}
                    user={user}
                    assessment={modulEditor[0].assessment}
                  />
                ) : data.type === 'stack' ? (
                  <StackDrag
                    stack={data}
                    modulCompleted={modulCompleted}
                    token={token}
                    user={user}
                    assessment={modulEditor[0].assessment}
                  />
                ) : data.__component === 'editor.audio' ? (
                  <div className="w-full" key={idComponent}>
                    <audio
                      controls
                      src={data.Audio.data.attributes.url}
                      className="outline-none"
                    >
                      Your browser does not support the
                      <code>audio</code> element.
                    </audio>
                  </div>
                ) : data.type === 'stack-with-drag-drop' ? (
                  <div className="flex flex-col w-full" key={idComponent}>
                    <StackDragDrop
                      dragDrop={data}
                      modulCompleted={modulCompleted}
                      token={token}
                      user={user}
                      assessment={modulEditor[0].assessment}
                    />
                  </div>
                ) : data.type === 'essay' ? (
                  <Essay
                    essay={data}
                    modulCompleted={modulCompleted}
                    token={token}
                    user={user}
                    assessment={modulEditor[0].assessment}
                  />
                ) : (
                  <></>
                ),
              )}
            </div>
            <div className="w-full my-10 max-w-4xl flex flex-col items-center mx-auto">
              <div className="border-b w-full pb-2">
                <span className="font-medium border-b border-black pb-2.5">
                  Comments
                </span>
              </div>
              <div className="w-full min-h-[10rem] flex mt-10 font-medium">
                <span className="h-[fit-content] w-10 py-2 px-3 mr-5 text-white bg-blue-800">
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
                      className="w-fit mt-3 flex items-center font-medium text-white bg-blue-800 py-2 px-3"
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
                      <span className="h-[fit-content] w-10 py-2 px-3 mr-5 text-white bg-blue-800 font-medium">
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
                              new Date(data.attributes.publishedAt).getMonth() +
                              1
                            }-${new Date(
                              data.attributes.publishedAt,
                            ).getDate()}`}
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
                          className="text-blue-800 flex items-center"
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
                          className="text-blue-800 flex items-center"
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
                        className="text-blue-800 flex items-center"
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
                          <span className="h-[fit-content] w-10 py-2 px-3 mr-5 text-white bg-blue-800 font-medium">
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
                              className="text-blue-800 flex items-center"
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
                              className="text-blue-800 flex items-center"
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
                        <span className="h-[fit-content] w-10 py-2 px-3 mr-5 text-white bg-blue-800">
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
                              className="w-fit mt-3 flex items-center font-medium text-white bg-blue-800 py-2 px-3"
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
            <div className="w-full h-16 fixed bottom-0 left-0 right-0 z-10 border-t-2 bg-gray-50">
              <Container className="h-full grid grid-cols-3 grid-flow-col py-2.5">
                {modulList[modulList.map((e) => e.id).indexOf(modulId) - 1] ? (
                  !modulList[modulList.map((e) => e.id).indexOf(modulId) - 1]
                    .status ? (
                    <div className="w-full h-full flex justify-start">
                      <FancyLink
                        destination={`/your-learning/modul/${
                          modulList[
                            modulList.map((e) => e.id).indexOf(modulId) - 1
                          ].attributes.Slug
                        }`}
                        className="flex items-center font-medium text-sm lg:text-base text-blue-800"
                      >
                        <GrPrevious size={18} className="arrow mr-1" />
                        Previous
                      </FancyLink>
                    </div>
                  ) : (
                    <div className="w-full h-full" />
                  )
                ) : (
                  <div className="w-full h-full" />
                )}
                <div className="w-full h-full flex justify-center">
                  <button
                    onClick={doAnswer}
                    className="flex items-center font-medium text-xs lg:text-base text-white bg-blue-800 py-1 px-2"
                  >
                    <BsCheck2 size={28} className="mr-1" />
                    Mark as complete
                  </button>
                </div>
                {modulList[modulList.map((e) => e.id).indexOf(modulId) + 1] ? (
                  !modulList[modulList.map((e) => e.id).indexOf(modulId) + 1]
                    .status ? (
                    <div className="w-full h-full flex justify-end">
                      <FancyLink
                        destination={`/your-learning/modul/${
                          modulList[
                            modulList.map((e) => e.id).indexOf(modulId) + 1
                          ].attributes.Slug
                        }`}
                        className="flex items-center font-medium text-sm lg:text-base text-blue-800"
                      >
                        Next
                        <GrNext size={18} className="arrow ml-1" />
                      </FancyLink>
                    </div>
                  ) : (
                    <div className="w-full h-full" />
                  )
                ) : (
                  <div className="w-full h-full" />
                )}
              </Container>
            </div>
          </Container>
        </div>
      </div>
      <Footer seo={seo} className="pb-20" />
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

  if (!user.data.major?.Name) {
    return {
      notFound: true,
    }
  }

  const modulList = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/moduls?filters[major][Name][$eq]=${user.data.major.Name}&populate=deep`,
  )

  const countdownData = (date) => {
    let today = new Date().toISOString().slice(0, 10)

    const startDate = date
    const endDate = today

    const diffInMs = new Date(startDate) - new Date(endDate)
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
    return diffInDays
  }

  if (res.data[0]?.attributes.major.data?.attributes.Name) {
    if (
      !res.data[0].attributes.major.data?.attributes.Name ===
      user.data.major.Name
    ) {
      return {
        notFound: true,
      }
    } else {
      if (countdownData(res.data[0].attributes.Assignment_Deadline) < 0) {
        return {
          notFound: true,
        }
      }
    }
  } else {
    return {
      notFound: true,
    }
  }

  const userList = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
  )

  const comments = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/comments?filters[idModule][$eq]=${res.data[0].id}&populate=deep`,
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

  res.data[0].attributes.Editor = res.data[0].attributes.Editor.map(
    (data, id) => {
      if (
        data.__component === 'editor.drag-and-drop' ||
        data.type === 'stack-with-drag-drop'
      ) {
        return {
          ...data,
          Drop: data.Drop.map((item) => {
            return {
              id: item.id,
              Name: item.Name,
              Content: data.Drop.filter(
                (i) => i.Name === item.Name,
              ).map((k) => ({ Answer: k.Answer, Content: k.Content })),
            }
          }).reduce((unique, o) => {
            if (!unique.some((obj) => obj.Name === o.Name)) {
              unique.push(o)
            }
            return unique
          }, []),
        }
      } else if (data.type === 'essay') {
        return {
          ...data,
          Question: data.Question.map((item) => {
            return {
              id: item.id,
              Name: item.Name,
              Content: data.Question.filter(
                (i) => i.Name === item.Name,
              ).map((k) => ({ Answer: k.Answer, Content: k.Content })),
            }
          }).reduce((unique, o) => {
            if (!unique.some((obj) => obj.Name === o.Name)) {
              unique.push(o)
            }
            return unique
          }, []),
        }
      } else {
        return data
      }
    },
  )

  const completed = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/completeds?filters[idUser][$eq]=${user.data.id}&populate=deep`,
  )

  if (
    completed.data.data.find(
      (data) =>
        parseInt(data.attributes.idModule) === parseInt(res.data[0].id) &&
        parseInt(data.attributes.idUser) === parseInt(user.data.id),
    )?.attributes.finish
  ) {
    return {
      notFound: true,
    }
  } else if (!res.data[0].attributes.Editor[0]) {
    return {
      notFound: true,
    }
  }

  modulList.data.data = modulList.data.data
    .filter((item) => !(countdownData(item.attributes.Assignment_Deadline) < 0))
    .map((item, id) => {
      return {
        ...item,
        status: completed.data.data.find(
          (data) =>
            parseInt(data.attributes.idModule) === parseInt(item.id) &&
            parseInt(data.attributes.idUser) === parseInt(user.data.id),
        )
          ? completed.data.data.find(
              (data) =>
                parseInt(data.attributes.idModule) === parseInt(item.id) &&
                parseInt(data.attributes.idUser) === parseInt(user.data.id),
            ).attributes.finish
          : false,
      }
    })

  let newEditor = []
  let titleId = null
  let modulEditor = []
  let modul = res.data[0].attributes
  modul.Editor.forEach((data, id) => {
    if (data.__component === 'editor.title') {
      titleId = {
        id: data.id,
        title: data.Title,
      }
      newEditor.push(data)
    } else {
      let dataComponent = newEditor.find(
        (dataTitle) =>
          dataTitle.id === titleId.id && dataTitle.Title === titleId.title,
      )
      dataComponent.children
        ? dataComponent.children.push(data)
        : (dataComponent.children = [data])
    }
  })
  newEditor.forEach((data) => {
    if (
      data.id === parseInt(ctx.params.title) &&
      data.__component === 'editor.title'
    ) {
      modulEditor.push(data)
      data.children.forEach((child) => modulEditor.push(child))
    }
  })

  if(newEditor.find((e) => e.id === parseInt(ctx.params.title))) {
    return {
      props: {
        user: user.data,
        userList: userList.data,
        seo: seo.data.attributes,
        modul: res.data[0].attributes,
        modulEditor: modulEditor,
        modulList: modulList.data.data,
        modulCompleted: completed.data.data.find(
          (data) =>
            parseInt(data.attributes.idModule) === parseInt(res.data[0].id) &&
            parseInt(data.attributes.idUser) === parseInt(user.data.id),
        )
          ? completed.data.data.find(
              (data) =>
                parseInt(data.attributes.idModule) === parseInt(res.data[0].id) &&
                parseInt(data.attributes.idUser) === parseInt(user.data.id),
            )
          : null,
        comments: comments.data.data,
        modulId: res.data[0].id,
        token: cookies.token,
        checkNotif: checkNotif.data.length === all.length ? false : true,
      },
    }
  }else {
    return {
      notFound: true,
    }
  }
}
