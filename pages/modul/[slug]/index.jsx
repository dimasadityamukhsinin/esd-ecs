import Container from '@/components/modules/container'
import TitleComponent from '@/components/modules/editorial/titleComponent'
import YoutubeComponent from '@/components/modules/editorial/youtubeComponent'
import Header from '@/components/modules/header'
import Layout from '@/components/modules/layout'
import FancyLink from '@/components/utils/fancyLink'
import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { v4 as uuidv4 } from 'uuid'
import { BsCheck2, BsCheck2Square } from 'react-icons/bs'
import { BiConversation } from 'react-icons/bi'
import { GrNext, GrPrevious } from 'react-icons/gr'
import swal from 'sweetalert'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import DragDrop from '@/components/dnd/DragDrop'
import SEO from '@/components/utils/seo'
import nookies from 'nookies'
import axios from 'axios'

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
  const [field, setField] = useState({})
  const [progress, setProgress] = useState(false)
  const [dataComments, setComments] = useState(comments)
  let dragsFromBackend = []
  let dropsFromBackend = []

  modul.Editor = modul.Editor.map((data, id) => {
    if (data.__component === 'editor.drag-and-drop') {
      return {
        ...data,
        Drop: data.Drop.map((item) => {
          return {
            ...item,
            Name: item.Name,
            Content: data.Drop.filter((i) => i.Name === item.Name).map(
              (k) => k.Content,
            ),
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
  })

  modul.Editor.forEach((data, id) => {
    if (data.__component === 'editor.drag-and-drop') {
      dragsFromBackend.push({
        id: id,
        items: [],
      })
      data.Drag.forEach((item) => {
        dragsFromBackend
          .find((getId) => getId.id === id)
          .items.push({
            id: uuidv4(),
            content: item.Content,
            number: item.Number,
            to: item.To,
          })
      })
    }
  })

  const columnsFromBackend = {
    drag: {
      id: uuidv4(),
      name: 'Drag',
      content: dragsFromBackend,
    },
    drop: {
      id: uuidv4(),
      name: 'Drop',
      content: [],
    },
  }

  const [checkDrop, setCheckDrop] = useState([])

  const onDragEnd = (result, columns, setColumns, idComponent) => {
    if (!result.destination) return
    let dropContent = document.getElementsByClassName(`drops-${idComponent}`)[0]
      .children[result.destination.index].children[0].innerHTML

    let dragContent = columns.drag.content.find(
      (data) => data.id === idComponent,
    ).items[result.source.index].content

    if (result.destination.droppableId !== result.source.droppableId) {
      if (
        dropContent
          .split(' ')
          .find((data) => (data === '..........' ? true : false))
      ) {
        document.getElementsByClassName(`drops-${idComponent}`)[0].children[
          result.destination.index
        ].children[0].innerHTML = modul.Editor[idComponent].Drop[
          result.destination.index
        ].Content[0]
          .map((data) => (data ? data : dragContent))
          .join(' ')
      }
    }

    // if (result.destination.droppableId !== result.source.droppableId) {
    //   if (
    //     !modul.Editor[idComponent].Drop[result.destination.index]
    //       .Question_Column_1
    //   ) {
    //     if (
    //       dropContent
    //         .split(' ')
    //         .find((data) => (data === '..........' ? true : false))
    //     ) {
    //       document.getElementsByClassName(`drops-${idComponent}`)[0].children[
    //         result.destination.index
    //       ].children[0].innerHTML = `${dragContent} ${
    //         modul.Editor[idComponent].Drop[result.destination.index]
    //           .Question_Column_2
    //       } ${
    //         modul.Editor[idComponent].Drop[result.destination.index]
    //           .Question_Column_3
    //       }`
    //     }
    //   } else if (
    //     !modul.Editor[idComponent].Drop[result.destination.index]
    //       .Question_Column_2
    //   ) {
    //     if (
    //       dropContent
    //         .split(' ')
    //         .find((data) => (data === '..........' ? true : false))
    //     ) {
    //       document.getElementsByClassName(`drops-${idComponent}`)[0].children[
    //         result.destination.index
    //       ].children[0].innerHTML = `${
    //         modul.Editor[idComponent].Drop[result.destination.index]
    //           .Question_Column_1
    //       } ${dragContent} ${
    //         modul.Editor[idComponent].Drop[result.destination.index]
    //           .Question_Column_3
    //       }`
    //     }
    //   } else if (
    //     !modul.Editor[idComponent].Drop[result.destination.index]
    //       .Question_Column_3
    //   ) {
    //     if (
    //       dropContent
    //         .split(' ')
    //         .find((data) => (data === '..........' ? true : false))
    //     ) {
    //       document.getElementsByClassName(`drops-${idComponent}`)[0].children[
    //         result.destination.index
    //       ].children[0].innerHTML = `${
    //         modul.Editor[idComponent].Drop[result.destination.index]
    //           .Question_Column_1
    //       } ${
    //         modul.Editor[idComponent].Drop[result.destination.index]
    //           .Question_Column_2
    //       } ${dragContent}`
    //     }
    //   }
    //   setCheckDrop((prev) => {
    //     let data = [
    //       ...prev,
    //       {
    //         id: idComponent,
    //         index: result.destination.index,
    //       },
    //     ]
    //     return data
    //   })
    // }

    const { source, destination, combine, draggableId } = result

    // if (
    //   !modul.Editor[idComponent].Drop[result.destination.index]
    //     .Question_Column_1
    // ) {
    //   if (
    //     dropContent
    //       .split(' ')
    //       .find((data) => (data === '..........' ? true : false))
    //   ) {
    //     if (source.droppableId !== destination.droppableId) {
    //       const sourceColumn = columns.drag
    //       const destColumn = columns.drop
    //       const sourceItems = [...sourceColumn.content]
    //       const destItems = [...destColumn.content]
    //       sourceItems
    //         .find((data) => data.id === idComponent)
    //         .items.splice(source.index, 1)

    //       if (destItems.length === 0) {
    //         setColumns({
    //           drag: {
    //             id: sourceColumn.id,
    //             name: 'Drag',
    //             content: sourceItems,
    //           },
    //           drop: {
    //             id: destColumn.id,
    //             name: 'Drop',
    //             content: [
    //               {
    //                 id: idComponent,
    //                 items: [
    //                   {
    //                     index: result.destination.index,
    //                     content: dragContent,
    //                   },
    //                 ],
    //               },
    //             ],
    //           },
    //         })
    //       } else {
    //         if (destItems.find((data) => data.id === idComponent)) {
    //           destItems
    //             .find((data) => data.id === idComponent)
    //             .items.push({
    //               index: result.destination.index,
    //               content: dragContent,
    //             })
    //           setColumns({
    //             drag: {
    //               id: sourceColumn.id,
    //               name: 'Drag',
    //               content: sourceItems,
    //             },
    //             drop: {
    //               id: destColumn.id,
    //               name: 'Drop',
    //               content: destItems,
    //             },
    //           })
    //         } else {
    //           setColumns({
    //             drag: {
    //               id: sourceColumn.id,
    //               name: 'Drag',
    //               content: sourceItems,
    //             },
    //             drop: {
    //               id: destColumn.id,
    //               name: 'Drop',
    //               content: [
    //                 ...destItems,
    //                 {
    //                   id: idComponent,
    //                   items: [
    //                     {
    //                       index: result.destination.index,
    //                       content: dragContent,
    //                     },
    //                   ],
    //                 },
    //               ],
    //             },
    //           })
    //         }
    //       }
    //     }
    //   }
    // } else if (
    //   !modul.Editor[idComponent].Drop[result.destination.index]
    //     .Question_Column_2
    // ) {
    //   if (
    //     dropContent
    //       .split(' ')
    //       .find((data) => (data === '..........' ? true : false))
    //   ) {
    //     if (source.droppableId !== destination.droppableId) {
    //       const sourceColumn = columns.drag
    //       const destColumn = columns.drop
    //       const sourceItems = [...sourceColumn.content]
    //       sourceItems
    //         .find((data) => data.id === idComponent)
    //         .items.splice(source.index, 1)
    //       setColumns({
    //         drag: {
    //           id: sourceColumn.id,
    //           name: 'Drag',
    //           content: sourceItems,
    //         },
    //         drop: {
    //           id: destColumn.id,
    //           name: 'Drop',
    //           content: [],
    //         },
    //       })

    //       if (destItems.length === 0) {
    //         setColumns({
    //           drag: {
    //             id: sourceColumn.id,
    //             name: 'Drag',
    //             content: sourceItems,
    //           },
    //           drop: {
    //             id: destColumn.id,
    //             name: 'Drop',
    //             content: [
    //               {
    //                 id: idComponent,
    //                 items: [
    //                   {
    //                     index: result.destination.index,
    //                     content: dragContent,
    //                   },
    //                 ],
    //               },
    //             ],
    //           },
    //         })
    //       } else {
    //         if (destItems.find((data) => data.id === idComponent)) {
    //           destItems
    //             .find((data) => data.id === idComponent)
    //             .items.push({
    //               index: result.destination.index,
    //               content: dragContent,
    //             })
    //           setColumns({
    //             drag: {
    //               id: sourceColumn.id,
    //               name: 'Drag',
    //               content: sourceItems,
    //             },
    //             drop: {
    //               id: destColumn.id,
    //               name: 'Drop',
    //               content: destItems,
    //             },
    //           })
    //         } else {
    //           setColumns({
    //             drag: {
    //               id: sourceColumn.id,
    //               name: 'Drag',
    //               content: sourceItems,
    //             },
    //             drop: {
    //               id: destColumn.id,
    //               name: 'Drop',
    //               content: [
    //                 ...destItems,
    //                 {
    //                   id: idComponent,
    //                   items: [
    //                     {
    //                       index: result.destination.index,
    //                       content: dragContent,
    //                     },
    //                   ],
    //                 },
    //               ],
    //             },
    //           })
    //         }
    //       }
    //     }
    //   }
    // } else if (
    //   !modul.Editor[idComponent].Drop[result.destination.index]
    //     .Question_Column_3
    // ) {
    //   if (
    //     dropContent
    //       .split(' ')
    //       .find((data) => (data === '..........' ? true : false))
    //   ) {
    //     if (source.droppableId !== destination.droppableId) {
    //       const sourceColumn = columns.drag
    //       const destColumn = columns.drop
    //       const sourceItems = [...sourceColumn.content]
    //       sourceItems
    //         .find((data) => data.id === idComponent)
    //         .items.splice(source.index, 1)
    //       setColumns({
    //         drag: {
    //           id: sourceColumn.id,
    //           name: 'Drag',
    //           content: sourceItems,
    //         },
    //         drop: {
    //           id: destColumn.id,
    //           name: 'Drop',
    //           content: [],
    //         },
    //       })

    //       if (destItems.length === 0) {
    //         setColumns({
    //           drag: {
    //             id: sourceColumn.id,
    //             name: 'Drag',
    //             content: sourceItems,
    //           },
    //           drop: {
    //             id: destColumn.id,
    //             name: 'Drop',
    //             content: [
    //               {
    //                 id: idComponent,
    //                 items: [
    //                   {
    //                     index: result.destination.index,
    //                     content: dragContent,
    //                   },
    //                 ],
    //               },
    //             ],
    //           },
    //         })
    //       } else {
    //         if (destItems.find((data) => data.id === idComponent)) {
    //           destItems
    //             .find((data) => data.id === idComponent)
    //             .items.push({
    //               index: result.destination.index,
    //             })
    //           setColumns({
    //             drag: {
    //               id: sourceColumn.id,
    //               name: 'Drag',
    //               content: sourceItems,
    //             },
    //             drop: {
    //               id: destColumn.id,
    //               name: 'Drop',
    //               content: destItems,
    //             },
    //           })
    //         } else {
    //           setColumns({
    //             drag: {
    //               id: sourceColumn.id,
    //               name: 'Drag',
    //               content: sourceItems,
    //             },
    //             drop: {
    //               id: destColumn.id,
    //               name: 'Drop',
    //               content: [
    //                 ...destItems,
    //                 {
    //                   id: idComponent,
    //                   items: [
    //                     {
    //                       index: result.destination.index,
    //                       content: dragContent,
    //                     },
    //                   ],
    //                 },
    //               ],
    //             },
    //           })
    //         }
    //       }
    //     }
    //   }
    // }

    // if(combine) {
    //   // super simple: just removing the dragging item
    //   const items = [...this.state.items];
    //   items.splice(result.source.index, 1);
    //   setState({ items });
    //   return;
    // }
  }
  const [columns, setColumns] = useState(columnsFromBackend)

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

  const resetDnd = () => {
    setColumns(columnsFromBackend)
  }

  const removeDrag = (idComponent, index, item) => {
    const getDragComponent = columns.drag.content.find(
      (getId) => getId.id === idComponent,
    )
    const getDropComponent = columns.drop.content.find(
      (getId) => getId.id === idComponent,
    ).items
    getDragComponent.items.push({
      id: uuidv4(),
      content: getDropComponent.find((item) => item.index === index).content,
    })

    const getDropIndex = getDropComponent.findIndex(
      (data) => data.index === index,
    )
    getDropComponent.splice(getDropIndex, 1)

    setColumns({
      drag: {
        id: columns.drag.id,
        name: 'Drag',
        content: [...columns.drag.content, getDragComponent],
      },
      drop: {
        id: columns.drop.id,
        name: 'Drop',
        content: [
          ...columns.drop.content,
          {
            id: idComponent,
            items: [getDropComponent],
          },
        ],
      },
    })

    const getCheckDropIndex = checkDrop.findIndex(
      (data) => data.index === index && data.id === idComponent,
    )
    checkDrop.splice(getCheckDropIndex, 1)

    document.getElementsByClassName(`drops-${idComponent}`)[0].children[
      index
    ].children[0].innerHTML = `${
      item.Question_Column_1 ? item.Question_Column_1 : '..........'
    } ${item.Question_Column_2 ? item.Question_Column_2 : '..........'} ${
      item.Question_Column_3 ? item.Question_Column_3 : '..........'
    }`
  }

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
        title={modul.Title}
        defaultSEO={typeof seo !== 'undefined' && seo}
        webTitle={typeof seo !== 'undefined' && seo.Website_Title}
      />
      <Header user={user} notif={checkNotif} logo={seo.Logo.data.attributes.url} title={seo.Website_Title} />
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
      <div className="relative flex flex-col w-full">
        <Container className="mt-4 md:mt-6 xl:mt-8">
          <div className="w-full max-w-4xl flex flex-col items-center mx-auto space-y-8">
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
              ) : data.__component === 'editor.drag-and-drop' ? (
                <div className="flex flex-col w-full" key={idComponent}>
                  <DragDrop data={data} idComponent={idComponent} />
                  <div className="flex justify-end w-full mt-3">
                    <FancyLink
                      onClick={() => resetDnd()}
                      className="font-medium text-white bg-yellow-400 py-2 px-4 rounded-md"
                    >
                      Reset
                    </FancyLink>
                  </div>
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
                          placeholder="..............."
                          className="w-full pl-3 py-1 border-t border-black placeholder:text-yellow-500 text-yellow-500 outline-none"
                        />
                      ) : (
                        <input
                          key={idLeft}
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
                          placeholder="..............."
                          className="w-full pl-3 py-1 border-t border-black placeholder:text-yellow-500 text-yellow-500 outline-none"
                        />
                      ) : (
                        <input
                          key={idRight}
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
                        className="outline-none text-center border rounded-r-md bg-yellow-400 text-white border-yellow-400"
                      />
                    </div>
                  ))}
                </div>
              ) : data.type === 'stack-with-drag' ? (
                <div
                  className="w-full flex flex-col space-y-4"
                  key={idComponent}
                >
                  {data.Drag.map((item, idStack) => (
                    <div className="w-full grid grid-cols-12" key={idStack}>
                      <div className="outline-none rounded-l-md border border-yellow-400 flex justify-center items-center">
                        <span>{idStack + 1}</span>
                      </div>
                      <div className="w-full h-full p-3 col-span-11 rounded-r-md border-t border-b border-r border-yellow-400 bg-yellow-400 text-white">
                        <span>{item.Content}</span>
                      </div>
                    </div>
                  ))}
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
                  <div className="w-full flex flex-col space-y-4">
                    {data.Drop.map((item, idStack) => (
                      <div className="w-full grid grid-cols-12" key={idStack}>
                        <div className="outline-none rounded-l-md border border-yellow-400 flex justify-center items-center">
                          <span>{idStack + 1}</span>
                        </div>
                        <div className="w-full h-full p-3 col-span-11 rounded-r-md border-t border-b border-r border-yellow-400 bg-yellow-400 text-white">
                          <span>{item.Content}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end w-full mt-3">
                    <FancyLink
                      onClick={() => resetDnd()}
                      className="font-medium text-white bg-yellow-400 py-2 px-4 rounded-md"
                    >
                      Reset
                    </FancyLink>
                  </div>
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
          <div className="w-full h-16 fixed bottom-0 left-0 right-0 border-t-2 bg-gray-50">
            <Container className="h-full grid grid-cols-3 grid-flow-col py-2.5">
              {modulList[modulList.map((e) => e.id).indexOf(modulId) - 1] ? (
                <div className="w-full h-full flex justify-start">
                  <FancyLink
                    destination={`/modul/${
                      modulList[modulList.map((e) => e.id).indexOf(modulId) - 1]
                        .attributes.Slug
                    }`}
                    className="flex items-center font-medium text-yellow-500 py-1 px-2"
                  >
                    <GrPrevious size={18} className="arrow mr-1" />
                    Previous
                  </FancyLink>
                </div>
              ) : (
                <div className="w-full h-full" />
              )}
              <div className="w-full h-full flex justify-center">
                <FancyLink
                  onClick={() => checkComplete()}
                  className="flex items-center font-medium text-white bg-yellow-400 py-1 px-2"
                >
                  <BsCheck2 size={28} className="mr-1" />
                  Mark as complete
                </FancyLink>
              </div>
              {modulList[modulList.map((e) => e.id).indexOf(modulId) + 1] ? (
                <div className="w-full h-full flex justify-end">
                  <FancyLink
                    destination={`/modul/${
                      modulList[modulList.map((e) => e.id).indexOf(modulId) + 1]
                        .attributes.Slug
                    }`}
                    className="flex items-center font-medium text-yellow-500 py-1 px-2"
                  >
                    Next
                    <GrNext size={18} className="arrow ml-1" />
                  </FancyLink>
                </div>
              ) : (
                <div className="w-full h-full" />
              )}
            </Container>
          </div>
        </Container>
      </div>
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

  return {
    props: {
      user: user.data,
      userList: userList.data,
      seo: seo.data.attributes,
      modul: res.data[0].attributes,
      modulList: modulList.data.data.filter(
        (item) => !(countdownData(item.attributes.Assignment_Deadline) < 0),
      ),
      comments: comments.data.data,
      modulId: res.data[0].id,
      token: cookies.token,
      checkNotif: checkNotif.data.length === all.length ? false : true,
    },
  }
}
