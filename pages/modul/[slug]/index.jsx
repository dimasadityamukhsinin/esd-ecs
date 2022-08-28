import Container from '@/components/modules/container'
import TitleComponent from '@/components/modules/editorial/titleComponent'
import YoutubeComponent from '@/components/modules/editorial/youtubeComponent'
import Header from '@/components/modules/header'
import Layout from '@/components/modules/layout'
import FancyLink from '@/components/utils/fancyLink'
import { useRef, useState } from 'react'
import { BsCheck2, BsCheck2Square } from 'react-icons/bs'
import { BiConversation } from 'react-icons/bi'
import { GrNext, GrPrevious } from 'react-icons/gr'
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

export default function ModulSlug({
  user,
  userList,
  modul,
  modulList,
  seo,
  comments,
  modulId,
  token,
  checkNotif,
}) {
  const ref = useRef()
  const route = useRouter()
  const [answer, setAnswer] = useState([])
  const [fieldModul, setFieldModul] = useState({})
  const [fieldComment, setFieldComment] = useState({})
  const [progress, setProgress] = useState(false)
  const [dataComments, setComments] = useState(comments)

  const checkComplete = () => {
    swal({
      title: 'Have you finished your assignment?',
      icon: 'warning',
      buttons: true,
      // dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal('Congratulations, your assignment has been completed!', {
          icon: 'success',
        })
      }
    })
  }

  const setValueComment = (e) => {
    const target = e.target
    const name = target.name
    const value = target.value

    setFieldComment({
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

    setFieldComment({})
    e.target.reset()

    setProgress(false)
  }

  const doAnswer = async (e) => {
    swal({
      title: 'Have you finished your assignment?',
      icon: 'warning',
      buttons: true,
      // dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        let dataAnswer = []
        let dataContent = []

        modul.Editor.filter((data) => data.Name).forEach((data) => {
          if (data.type === 'drag-drop') {
            let idName = 0
            data.Drop.forEach((item, id) => {
              idName = 0
              item.Content.forEach((e) => {
                if (!e.Answer) {
                  idName++
                  dataAnswer.push({
                    name: `${data.Name}_${item.Name}_${idName}`,
                    value:
                      document.getElementsByName(
                        `${data.Name}_${item.Name}_${idName}`,
                      )[0].innerText !== '..........'
                        ? document.getElementsByName(
                            `${data.Name}_${item.Name}_${idName}`,
                          )[0].innerText
                        : '',
                  })
                }
              })
            })
          } else if (data.type === 'stack-with-drag-drop') {
            let dragDrop = []
            let stack = []

            data.Drop.forEach((item) => {
              item.Content.forEach((e, id) => {
                if (e.Answer) {
                  dragDrop.push({
                    name: `${data.Name}_${item.Name}_${id + 1}`,
                    value:
                      document.getElementsByName(
                        `${data.Name}_${item.Name}_${id + 1}`,
                      )[0].innerText !== '..........'
                        ? document.getElementsByName(
                            `${data.Name}_${item.Name}_${id + 1}`,
                          )[0].innerText
                        : '',
                  })
                }
              })
            })

            data.Drop.forEach((item, id) => {
              let name = document.getElementById(`${data.Name}`).children[id]
                .attributes.name.value
              stack.push({
                name: `${name}_to_${id + 1}`,
                value: data.Drop.find(
                  (e) =>
                    parseInt(e.Name.split('-')[1]) ===
                    parseInt(name.split('_')[1].split('-')[1]),
                )
                  .Content.map((e) => e.Content)
                  .join(' '),
              })
            })

            dataAnswer.push({
              name: data.Name,
              dragDrop: dragDrop,
              stack: stack,
              type: 'stack-with-drag-drop',
            })
          } else if (data.type === 'stack') {
            data.Drag.forEach((item, id) => {
              let name = document.getElementById(`${data.Name}`).children[id]
                .attributes.name.value
              dataAnswer.push({
                name: `${name}_to_${id + 1}`,
                value: data.Drag.find(
                  (e) =>
                    parseInt(e.Name.split('-')[1]) ===
                    parseInt(name.split('_')[1].split('-')[1]),
                ).Content,
              })
            })
          } else if (
            data.type === 'fill-left-answer' ||
            data.type === 'fill-right-answer'
          ) {
            data.question_and_answer.forEach((_, id) => {
              dataAnswer.push({
                name: `${data.Name}_${id + 1}`,
                value: document.getElementsByName(`${data.Name}_${id + 1}`)[0]
                  .value,
              })
            })
          } else if (data.type === 'arrange') {
            data.Arrange.forEach((_, id) => {
              dataAnswer.push({
                name: `${data.Name}_${id + 1}`,
                value: document.getElementsByName(`${data.Name}_${id + 1}`)[0]
                  .value,
              })
            })
          }
        })

        modul.Editor.forEach((data) => {
          const check = dataAnswer.filter(
            (item) => item.name.split('_')[0] === data.Name,
          )

          if (data.type === 'fill-left-answer') {
            let content = []
            data.question_and_answer.forEach((item, id) => {
              content.push({
                Key: check[id].value,
                Answer:
                  check[id].value.toLowerCase() === item.Answer.toLowerCase(),
              })
            })
            dataContent.push({
              __component: 'question.fill-in-the-blank-left-answer',
              Name: data.Name,
              Content: content,
              Score: Number.isInteger(
                (data.Point / data.question_and_answer.length) *
                  content.filter((item) => item.Answer === true).length,
              )
                ? (data.Point / data.question_and_answer.length) *
                  content.filter((item) => item.Answer === true).length
                : parseFloat(
                    (data.Point / data.question_and_answer.length) *
                      content.filter((item) => item.Answer === true).length,
                  ).toFixed(2),
            })
          } else if (data.type === 'fill-right-answer') {
            let content = []
            data.question_and_answer.forEach((item, id) => {
              content.push({
                Key: check[id].value,
                Answer:
                  check[id].value.toLowerCase() === item.Answer.toLowerCase(),
              })
            })
            dataContent.push({
              __component: 'question.fill-in-the-blank-right-answer',
              Name: data.Name,
              Content: content,
              Score: Number.isInteger(
                (data.Point / data.question_and_answer.length) *
                  content.filter((item) => item.Answer === true).length,
              )
                ? (data.Point / data.question_and_answer.length) *
                  content.filter((item) => item.Answer === true).length
                : parseFloat(
                    (data.Point / data.question_and_answer.length) *
                      content.filter((item) => item.Answer === true).length,
                  ).toFixed(2),
            })
          } else if (data.type === 'stack') {
            let content = []
            data.Drag.forEach((_, id) => {
              content.push({
                Name: check[id].name.split('_')[1],
                Content: check[id].value,
                Answer:
                  parseInt(check[id].name.split('_')[1].split('-')[1]) ===
                  parseInt(check[id].name.split('_')[3]),
              })
            })
            dataContent.push({
              __component: 'question.stack',
              Name: data.Name,
              Content: content,
              Score: Number.isInteger(
                (data.Point / data.Drag.length) *
                  content.filter((item) => item.Answer === true).length,
              )
                ? (data.Point / data.Drag.length) *
                  content.filter((item) => item.Answer === true).length
                : parseFloat(
                    (data.Point / data.Drag.length) *
                      content.filter((item) => item.Answer === true).length,
                  ).toFixed(2),
            })
          } else if (data.type === 'arrange') {
            let content = []
            data.Arrange.forEach((item, id) => {
              content.push({
                Key: check[id].value,
                Answer: parseInt(check[id].value) === parseInt(item.Number),
              })
            })
            dataContent.push({
              __component: 'question.arrange',
              Name: data.Name,
              Content: content,
              Score: Number.isInteger(
                (data.Point / data.Arrange.length) *
                  content.filter((item) => item.Answer === true).length,
              )
                ? (data.Point / data.Arrange.length) *
                  content.filter((item) => item.Answer === true).length
                : parseFloat(
                    (data.Point / data.Arrange.length) *
                      content.filter((item) => item.Answer === true).length,
                  ).toFixed(2),
            })
          } else if (data.type === 'drag-drop') {
            let content = []
            let idName = 0
            data.Drop.forEach((item, id) => {
              item.Content.forEach((e) => {
                if (e.Answer) {
                  if (check[idName]) {
                    content.push({
                      Name: item.Name,
                      Key: check[idName].value,
                      Answer:
                        check[idName].value.toLowerCase() ===
                        e.Content.toLowerCase(),
                    })
                  }
                  idName++
                }
              })
            })

            dataContent.push({
              __component: 'question.drag-and-drop',
              Name: data.Name,
              Content: content,
              Score: Number.isInteger(
                (data.Point / data.Drag.length) *
                  content.filter((item) => item.Answer === true).length,
              )
                ? (data.Point / data.Drag.length) *
                  content.filter((item) => item.Answer === true).length
                : parseFloat(
                    (data.Point / data.Drag.length) *
                      content.filter((item) => item.Answer === true).length,
                  ).toFixed(2),
            })
          } else if (data.type === 'stack-with-drag-drop') {
            let dragDrop = []

            data.Drop.forEach((item) => {
              item.Content.forEach((e, id) => {
                if (e.Answer) {
                  dragDrop.push({
                    Name: item.Name,
                    Key: check[0].dragDrop.find(
                      (y) => y.name === `${data.Name}_${item.Name}_${id + 1}`,
                    ).value,
                    Answer:
                      check[0].dragDrop
                        .find(
                          (y) =>
                            y.name === `${data.Name}_${item.Name}_${id + 1}`,
                        )
                        .value.toLowerCase() === e.Content.toLowerCase(),
                  })
                }
              })
            })

            let stack = []
            data.Drop.forEach((_, id) => {
              stack.push({
                Name: check[0].stack[id].name.split('_')[1],
                Content: check[0].stack[id].value,
                Answer:
                  parseInt(check[0].stack[id].name.split('_')[1].split('-')[1]) ===
                  parseInt(check[0].stack[id].name.split('_')[3]),
              })
            })
            dataContent.push({
              __component: 'question.stack-with-drag-and-drop',
              Name: data.Name,
              Drag_Drop: dragDrop,
              Stack: stack,
              Score: Number.isInteger(
                (data.Point_Stack / data.Drop.length) *
                  dragDrop.filter((item) => item.Answer === true).length +
                  (data.Point_Drop / data.Drop.length) *
                    dragDrop.filter((item) => item.Answer === true).length,
              )
                ? (data.Point_Stack / data.Drop.length) *
                    dragDrop.filter((item) => item.Answer === true).length +
                  (data.Point_Drop / data.Drop.length) *
                    dragDrop.filter((item) => item.Answer === true).length
                : parseFloat(
                    (data.Point_Stack / data.Drop.length) *
                      dragDrop.filter((item) => item.Answer === true).length +
                      (data.Point_Drop / data.Drop.length) *
                        dragDrop.filter((item) => item.Answer === true).length,
                  ).toFixed(2),
            })
          }
        })

        let Total_Score = 0

        dataContent.forEach((item) => {
          Total_Score = Total_Score + item.Score
        })

        let date = new Date()
        let dd = String(date.getDate()).padStart(2, '0')
        let mm = String(date.getMonth() + 1).padStart(2, '0') //January is 0!
        let yyyy = date.getFullYear()

        date = yyyy + '-' + mm + '-' + dd

        console.log({
          data: {
            idModul: modulId,
            idUser: user.id,
            User: user.Full_Name,
            Modul_Name: modul.Title,
            Question: dataContent,
            Date: date,
            Total_Score: Total_Score,
          },
        })

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/completeds`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              idModul: modulId,
              idUser: user.id,
              User: user.Full_Name,
              Modul_Name: modul.Title,
              Question: dataContent,
              Date: date,
              Total_Score: Number.isInteger(Total_Score)
                ? Total_Score
                : parseFloat(Total_Score).toFixed(2),
            },
          }),
        }).then(() => {
          swal('Congratulations, your assignment has been completed!', {
            icon: 'success',
          })
          setTimeout(() => {
            route.replace('/')
          }, 50)
        })
      }
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
          <FancyLink destination="/" className="font-medium flex items-center">
            <BsCheck2Square size={20} className="mr-2" />
            Assignment
          </FancyLink>
          <FancyLink
            destination={`/modul/${modul.Slug}/conversations`}
            className="font-medium flex items-center"
          >
            <BiConversation size={20} className="mr-2" />
            Conversations
          </FancyLink>
        </div>
      </div>
      <div className="relative flex flex-col w-full pb-12 grow">
        <Container className="mt-4 md:mt-6 xl:mt-8">
          <div
            ref={ref}
            className="w-full max-w-4xl flex flex-col items-center mx-auto space-y-8"
          >
            {modul.Editor?.map((data, idComponent) =>
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
                  <DragDrop dragDrop={data} idComponent={idComponent} />
                </div>
              ) : data.type === 'fill-left-answer' ? (
                <div
                  className="grid grid-cols-[2fr,1fr,2fr] grid-flow-col w-full border border-black"
                  key={idComponent}
                >
                  <div className="w-full border-r border-black h-full flex flex-col">
                    {data.question_and_answer.map((_, idLeft) =>
                      idLeft !== 0 ? (
                        <input
                          key={idLeft}
                          onKeyDown={(e) => (e.keyCode === 32 ? false : true)}
                          onChange={(e) =>
                            (e.target.value = e.target.value.replace(/\s/g, ''))
                          }
                          name={`${data.Name}_${idLeft + 1}`}
                          placeholder="..............."
                          className="w-full pl-3 py-1 border-t border-black placeholder:text-yellow-500 text-yellow-500 outline-none"
                        />
                      ) : (
                        <input
                          key={idLeft}
                          onKeyDown={(e) => (e.keyCode === 32 ? false : true)}
                          onChange={(e) =>
                            (e.target.value = e.target.value.replace(/\s/g, ''))
                          }
                          name={`${data.Name}_${idLeft + 1}`}
                          placeholder="..............."
                          className="w-full pl-3 py-1 placeholder:text-yellow-500 text-yellow-500 outline-none"
                        />
                      ),
                    )}
                  </div>
                  <div className="w-full flex justify-center items-center h-full">
                    <span>{data.Verb}</span>
                  </div>
                  <div className="w-full border-l border-black h-full flex flex-col">
                    {data.question_and_answer.map((item, idLeft) =>
                      idLeft !== 0 ? (
                        <div
                          key={idLeft}
                          className="w-full pl-3 py-1 border-t border-black"
                        >
                          {item.Question}
                        </div>
                      ) : (
                        <div key={idLeft} className="w-full pl-3 py-1">
                          {item.Question}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ) : data.type === 'fill-right-answer' ? (
                <div
                  className="grid grid-cols-[2fr,1fr,2fr] grid-flow-col w-full border border-black"
                  key={idComponent}
                >
                  <div className="w-full border-r border-black h-full flex flex-col">
                    {data.question_and_answer.map((item, idRight) =>
                      idRight !== 0 ? (
                        <div
                          key={idRight}
                          className="w-full pl-3 py-1 border-t border-black"
                        >
                          {item.Question}
                        </div>
                      ) : (
                        <div key={idRight} className="w-full pl-3 py-1">
                          {item.Question}
                        </div>
                      ),
                    )}
                  </div>
                  <div className="w-full flex justify-center items-center h-full">
                    <span>{data.Verb}</span>
                  </div>
                  <div className="w-full border-l border-black h-full flex flex-col">
                    {data.question_and_answer.map((_, idRight) =>
                      idRight !== 0 ? (
                        <input
                          key={idRight}
                          name={`${data.Name}_${idRight + 1}`}
                          onKeyDown={(e) => (e.keyCode === 32 ? false : true)}
                          onChange={(e) =>
                            (e.target.value = e.target.value.replace(/\s/g, ''))
                          }
                          placeholder="..............."
                          className="w-full pl-3 py-1 border-t border-black placeholder:text-yellow-500 text-yellow-500 outline-none"
                        />
                      ) : (
                        <input
                          key={idRight}
                          name={`${data.Name}_${idRight + 1}`}
                          onKeyDown={(e) => (e.keyCode === 32 ? false : true)}
                          onChange={(e) =>
                            (e.target.value = e.target.value.replace(/\s/g, ''))
                          }
                          placeholder="..............."
                          className="w-full pl-3 py-1 placeholder:text-yellow-500 text-yellow-500 outline-none"
                        />
                      ),
                    )}
                  </div>
                </div>
              ) : data.type === 'arrange' ? (
                <div
                  className="w-full grid grid-cols-3 gap-6"
                  key={idComponent}
                >
                  {data.Arrange.map((item, idArrange) => (
                    <div
                      key={idArrange}
                      className="w-full grid grid-cols-4 grid-flow-col"
                    >
                      <div className="w-full h-full p-1 border-t border-l border-b rounded-l-md border-yellow-400 col-span-3 flex justify-center items-center">
                        <span>{item.Content}</span>
                      </div>
                      <input
                        type="number"
                        name={`${data.Name}_${idArrange + 1}`}
                        className="outline-none text-center border rounded-r-md bg-yellow-400 text-white border-yellow-400"
                      />
                    </div>
                  ))}
                </div>
              ) : data.type === 'stack' ? (
                <div
                  id={data.Name}
                  className="w-full flex flex-col space-y-4"
                  key={idComponent}
                >
                  <StackDrag data={data} idComponent={idComponent} />
                </div>
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
                  <StackDragDrop dragDrop={data} idComponent={idComponent} />
                </div>
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
                    onChange={setValueComment}
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
              {dataComments.map((data, id) => (
                <div key={id} className="w-full border-b pb-6 flex mt-10">
                  <span className="h-[fit-content] w-10 py-2 px-3 mr-5 text-white bg-yellow-400 font-medium">
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
              ))}
            </div>
          </div>
          <div className="w-full h-16 fixed bottom-0 left-0 right-0 z-10 border-t-2 bg-gray-50">
            <Container className="h-full grid grid-cols-3 grid-flow-col py-2.5">
              {modulList[modulList.map((e) => e.id).indexOf(modulId) - 1] ? (
                modulList[modulList.map((e) => e.id).indexOf(modulId) - 1]
                  .status !== 'completed' ? (
                  <div className="w-full h-full flex justify-start">
                    <FancyLink
                      destination={`/modul/${
                        modulList[
                          modulList.map((e) => e.id).indexOf(modulId) - 1
                        ].attributes.Slug
                      }`}
                      className="flex items-center font-medium text-sm lg:text-base text-yellow-500"
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
                  className="flex items-center font-medium text-xs lg:text-base text-white bg-yellow-400 py-1 px-2"
                >
                  <BsCheck2 size={28} className="mr-1" />
                  Mark as complete
                </button>
              </div>
              {modulList[modulList.map((e) => e.id).indexOf(modulId) + 1] ? (
                modulList[modulList.map((e) => e.id).indexOf(modulId) + 1]
                  .status !== 'completed' ? (
                  <div className="w-full h-full flex justify-end">
                    <FancyLink
                      destination={`/modul/${
                        modulList[
                          modulList.map((e) => e.id).indexOf(modulId) + 1
                        ].attributes.Slug
                      }`}
                      className="flex items-center font-medium text-sm lg:text-base text-yellow-500"
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

  if (res.data[0].attributes.major.data?.attributes.Name) {
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
      } else {
        return data
      }
    },
  )

  const completed = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/completeds?filters[idUser][$eq]=${user.data.id}&populate=deep`,
    {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    },
  )

  if (
    completed.data.data.find(
      (data) =>
        parseInt(data.attributes.idModul) === parseInt(res.data[0].id) &&
        parseInt(data.attributes.idUser) === parseInt(user.data.id),
    )
  ) {
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
            parseInt(data.attributes.idModul) === parseInt(item.id) &&
            parseInt(data.attributes.idUser) === parseInt(user.data.id),
        )
          ? 'completed'
          : '',
      }
    })

  return {
    props: {
      user: user.data,
      userList: userList.data,
      seo: seo.data.attributes,
      modul: res.data[0].attributes,
      modulList: modulList.data.data,
      comments: comments.data.data,
      modulId: res.data[0].id,
      token: cookies.token,
      checkNotif: checkNotif.data.length === all.length ? false : true,
    },
  }
}
