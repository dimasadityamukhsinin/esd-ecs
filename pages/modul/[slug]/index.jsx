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

export default function ModulSlug({ modul }) {
  let dragsFromBackend = []
  let dropsFromBackend = []

  modul.Editor.forEach((data, id) => {
    if (data.__component === 'editor.drag-and-drop') {
      dragsFromBackend.push({
        id: id,
        items: [],
      })
      data.Drag.forEach((item) => {
        if (dragsFromBackend.find((getId) => getId.id === id)) {
          dragsFromBackend
            .find((getId) => getId.id === id)
            .items.push({ id: uuidv4(), content: item.Content })
        }
      })
    }
  })

  modul.Editor.forEach((data, id) => {
    if (data.__component === 'editor.drag-and-drop') {
      dropsFromBackend.push({
        id: id,
        items: [],
      })
      data.Drop.forEach((item) => {
        if (dropsFromBackend.find((getId) => getId.id === id)) {
          dropsFromBackend
            .find((getId) => getId.id === id)
            .items.push({
              id: uuidv4(),
              Key: item.Key,
              Answer: item.Answer,
              Question_Column_1: item.Question_Column_1,
              Question_Column_2: item.Question_Column_2,
              Question_Column_3: item.Question_Column_3,
            })
        }
      })
    }
  })

  // console.log(dropsFromBackend)

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
    let dropContent = document.getElementsByClassName(`drops-${idComponent}`)[0].children[
      result.destination.index
    ].children[0].innerHTML

    let dragContent = columns.drag.content.find(
      (data) => data.id === idComponent,
    ).items[result.source.index].content

    if (result.destination) {
      if (result.destination.droppableId !== result.source.droppableId) {
        if (
          !modul.Editor[idComponent].Drop[result.destination.index]
            .Question_Column_1
        ) {
          if (
            dropContent
              .split(' ')
              .find((data) => (data === '..........' ? true : false))
          ) {
            document.getElementsByClassName(`drops-${idComponent}`)[0].children[
              result.destination.index
            ].children[0].innerHTML = `${dragContent} ${
              modul.Editor[idComponent].Drop[result.destination.index]
                .Question_Column_2
            } ${
              modul.Editor[idComponent].Drop[result.destination.index]
                .Question_Column_3
            }`
          }
        } else if (
          !modul.Editor[idComponent].Drop[result.destination.index]
            .Question_Column_2
        ) {
          if (
            dropContent
              .split(' ')
              .find((data) => (data === '..........' ? true : false))
          ) {
            document.getElementsByClassName(`drops-${idComponent}`)[0].children[
              result.destination.index
            ].children[0].innerHTML = `${
              modul.Editor[idComponent].Drop[result.destination.index]
                .Question_Column_1
            } ${dragContent} ${
              modul.Editor[idComponent].Drop[result.destination.index]
                .Question_Column_3
            }`
          }
        } else if (
          !modul.Editor[idComponent].Drop[result.destination.index]
            .Question_Column_3
        ) {
          if (
            dropContent
              .split(' ')
              .find((data) => (data === '..........' ? true : false))
          ) {
            document.getElementsByClassName(`drops-${idComponent}`)[0].children[
              result.destination.index
            ].children[0].innerHTML = `${
              modul.Editor[idComponent].Drop[result.destination.index]
                .Question_Column_1
            } ${
              modul.Editor[idComponent].Drop[result.destination.index]
                .Question_Column_2
            } ${dragContent}`
          }
        }
        setCheckDrop((prev) => {
          let data = [
            ...prev,
            {
              id: idComponent,
              index: result.destination.index,
            },
          ]
          return data
        })
      }
    }

    if (!result.destination) return
    const { source, destination, combine, draggableId } = result

    if (
      !modul.Editor[idComponent].Drop[result.destination.index]
        .Question_Column_1
    ) {
      if (
        dropContent
          .split(' ')
          .find((data) => (data === '..........' ? true : false))
      ) {
        if (source.droppableId !== destination.droppableId) {
          const sourceColumn = columns.drag
          const destColumn = columns.drop
          const sourceItems = [...sourceColumn.content]
          sourceItems
            .find((data) => data.id === idComponent)
            .items.splice(source.index, 1)
          setColumns({
            drag: {
              id: sourceColumn.id,
              name: 'Drag',
              content: sourceItems,
            },
            drop: {
              id: destColumn.id,
              name: 'Drop',
              content: [],
            },
          })
        }
      }
    } else if (
      !modul.Editor[idComponent].Drop[result.destination.index]
        .Question_Column_2
    ) {
      if (
        dropContent
          .split(' ')
          .find((data) => (data === '..........' ? true : false))
      ) {
        if (source.droppableId !== destination.droppableId) {
          const sourceColumn = columns.drag
          const destColumn = columns.drop
          const sourceItems = [...sourceColumn.content]
          sourceItems
            .find((data) => data.id === idComponent)
            .items.splice(source.index, 1)
          setColumns({
            drag: {
              id: sourceColumn.id,
              name: 'Drag',
              content: sourceItems,
            },
            drop: {
              id: destColumn.id,
              name: 'Drop',
              content: [],
            },
          })
        }
      }
    } else if (
      !modul.Editor[idComponent].Drop[result.destination.index]
        .Question_Column_3
    ) {
      if (
        dropContent
          .split(' ')
          .find((data) => (data === '..........' ? true : false))
      ) {
        if (source.droppableId !== destination.droppableId) {
          const sourceColumn = columns.drag
          const destColumn = columns.drop
          const sourceItems = [...sourceColumn.content]
          sourceItems
            .find((data) => data.id === idComponent)
            .items.splice(source.index, 1)
          setColumns({
            drag: {
              id: sourceColumn.id,
              name: 'Drag',
              content: sourceItems,
            },
            drop: {
              id: destColumn.id,
              name: 'Drop',
              content: [],
            },
          })
        }
      }
    }

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

  const removeDrag = () => {}

  return (
    <Layout>
      <Header />
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
      <div className="relative flex flex-col w-full">
        <Container className="mt-4 md:mt-6 xl:mt-8">
          <div className="w-full max-w-4xl flex flex-col items-center mx-auto space-y-8">
            {modul.Editor.map((data, idComponent) =>
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
                  className="w-full flex flex-col space-y-3 text-lg editor"
                  dangerouslySetInnerHTML={{ __html: data.Content }}
                ></div>
              ) : data.__component === 'editor.drag-and-drop' ? (
                <div
                  className="flex flex-col w-full"
                  key={idComponent}
                >
                  <span className="font-medium">Instruction:</span>
                  <span>
                    Match the words in the boxes with the phrases below to make
                    them into imperative sentences.
                  </span>
                  <div className="w-full flex flex-col space-y-6 p-4 mt-4 rounded-lg editor border-2 border-yellow-400">
                    {process.browser && (
                      <DragDropContext
                        onDragEnd={(result) =>
                          onDragEnd(result, columns, setColumns, idComponent)
                        }
                      >
                        <div className="w-full" key={columns.drag.id}>
                          <div style={{ margin: 8 }}>
                            <Droppable
                              droppableId={columns.drag.id}
                              key={columns.drag.id}
                              direction="horizontal"
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="flex flex-wrap drag"
                                  >
                                    {columns.drag.content
                                      .find((getId) => getId.id === idComponent)
                                      .items.map((item, id) => (
                                        <Draggable
                                          key={`${item.id}`}
                                          draggableId={`${item.id}`}
                                          index={id}
                                        >
                                          {(provided, snapshot) => {
                                            return (
                                              <span
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="bg-yellow-400 w-fit py-2 px-3 text-white text-center font-medium rounded-md"
                                              >
                                                {item.content}
                                              </span>
                                            )
                                          }}
                                        </Draggable>
                                      ))}
                                    {provided.placeholder}
                                  </div>
                                )
                              }}
                            </Droppable>
                          </div>
                        </div>
                        <Droppable
                          droppableId={columns.drop.id}
                          key={columns.drop.id}
                          isCombineEnabled={true}
                        >
                          {(provided, snapshot) => {
                            // console.log(data)
                            return (
                              <ol
                                className={`list-inside list-decimal space-y-4 drops-${idComponent}`}
                                data-idComponent={idComponent}
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                              >
                                {data.Drop.map((item, id) => (
                                  <Draggable
                                    key={`${item.id}`}
                                    draggableId={`${item.id}`}
                                    index={id}
                                  >
                                    {(provided, snapshot) => {
                                      return (
                                        <>
                                          <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            data-id={id + 1}
                                          >
                                            <span className="inline-flex max-w-md">
                                              {item.Question_Column_1
                                                ? item.Question_Column_1
                                                : '.......... '}
                                              {` `}
                                              {item.Question_Column_2
                                                ? item.Question_Column_2
                                                : '.......... '}
                                              {` `}
                                              {item.Question_Column_3
                                                ? item.Question_Column_3
                                                : '.......... '}
                                            </span>
                                            {checkDrop
                                              .filter(
                                                (data) =>
                                                  data.id ===
                                                  idComponent,
                                              )
                                              .find(
                                                (item) => item.index === id,
                                              ) && (
                                              <FancyLink
                                                onClick={removeDrag}
                                                className="ml-6 rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-white"
                                              >
                                                Remove
                                              </FancyLink>
                                            )}
                                          </li>
                                        </>
                                      )
                                    }}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </ol>
                            )
                          }}
                        </Droppable>
                      </DragDropContext>
                    )}
                  </div>
                  <div className="flex justify-end w-full mt-3">
                    <FancyLink
                      onClick={() => resetDnd()}
                      className="font-medium text-white bg-yellow-400 py-1 px-4 rounded-md"
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
          <div className="w-full my-10 max-w-3xl flex flex-col items-center mx-auto">
            <div className="border-b w-full pb-2">
              <span className="font-medium border-b border-black pb-2.5">
                Comments
              </span>
            </div>
            <div className="w-full h-40 flex mt-10 font-medium">
              <span className="h-[fit-content] p-2 mr-5 text-white bg-yellow-400">
                DA
              </span>
              <div className="w-full flex flex-col">
                <span className="mb-2">Dimas Aditya</span>
                <div className="w-full h-full border border-black"></div>
              </div>
            </div>
            <div className="flex flex-col w-full space-y-6">
              <div className="w-full border-b pb-6 flex mt-10">
                <span className="h-[fit-content] p-2 mr-5 text-white bg-yellow-400 font-medium">
                  DA
                </span>
                <div className="w-full flex flex-col">
                  <div className="flex justify-between">
                    <span className="mb-2 font-medium">Dimas Aditya</span>
                    <span className="text-gray-500">23 JULI</span>
                  </div>
                  <div className="w-full h-full">
                    <p>Ok</p>
                  </div>
                </div>
              </div>
              <div className="w-full border-b pb-6 flex mt-10">
                <span className="h-[fit-content] p-2 mr-5 text-white bg-yellow-400 font-medium">
                  DA
                </span>
                <div className="w-full flex flex-col">
                  <div className="flex justify-between">
                    <span className="mb-2 font-medium">Dimas Aditya</span>
                    <span className="text-gray-500">23 JULI</span>
                  </div>
                  <div className="w-full h-full">
                    <p>Ok</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-16 fixed bottom-0 left-0 right-0 border-t-2 bg-gray-50">
            <Container className="h-full flex justify-between py-2.5">
              <FancyLink className="flex items-center font-medium text-yellow-500 py-1 px-2">
                <GrPrevious size={18} className="arrow mr-1" />
                Previous
              </FancyLink>
              <FancyLink
                onClick={() => checkComplete()}
                className="flex items-center font-medium text-white bg-yellow-400 py-1 px-2"
              >
                <BsCheck2 size={28} className="mr-1" />
                Mark as complete
              </FancyLink>
              <FancyLink className="flex items-center font-medium text-yellow-500 py-1 px-2">
                Next
                <GrNext size={18} className="arrow ml-1" />
              </FancyLink>
            </Container>
          </div>
        </Container>
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/moduls?populate=deep`,
  )
  const res = await req.json()

  const paths = res.data.map((data) => ({
    params: { slug: data.attributes.Slug },
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/moduls?filters[slug][$eq]=${params.slug}&populate=deep`,
  )
  const res = await req.json()

  return {
    props: {
      modul: res.data[0].attributes,
    },
  }
}
