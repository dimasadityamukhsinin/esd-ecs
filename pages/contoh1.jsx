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

export default function Contoh1({ modul }) {
  const itemsFromBackend = [
    { id: uuidv4(), content: 'Turn On' },
    { id: uuidv4(), content: 'Change' },
    { id: uuidv4(), content: 'Disable' },
    { id: uuidv4(), content: 'Consider' },
    { id: uuidv4(), content: 'Choose' },
    { id: uuidv4(), content: 'Reduce' },
    { id: uuidv4(), content: 'Switch off' },
    { id: uuidv4(), content: 'Reduce' },
    { id: uuidv4(), content: 'Turn off' },
    { id: uuidv4(), content: 'Make' },
  ]

  const columnsFromBackend = {
    [uuidv4()]: {
      name: 'Drag',
      items: itemsFromBackend,
    },
    [uuidv4()]: {
      name: 'Drop',
      items: [],
    },
  }

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return
    const { source, destination, combine } = result

    // if(combine) {
    //   // super simple: just removing the dragging item
    //   const items = [...this.state.items];
    //   items.splice(result.source.index, 1);
    //   setState({ items });
    //   return;
    // }

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId]
      const destColumn = columns[destination.droppableId]
      const sourceItems = [...sourceColumn.items]
      const destItems = [...destColumn.items]
      const [removed] = sourceItems.splice(source.index, 1)
      destItems.splice(destination.index, 0, removed)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      })
    } else {
      const column = columns[source.droppableId]
      const copiedItems = [...column.items]
      const [removed] = copiedItems.splice(source.index, 1)
      copiedItems.splice(destination.index, 0, removed)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      })
    }
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
      <Container className="mt-4 md:mt-6 xl:mt-8">
        <div className="w-full max-w-3xl flex flex-col items-center mx-auto space-y-8">
          {modul.attributes.Editor.map((data) =>
            data.__component === 'editor.title' ? (
              <TitleComponent title={data.Title} content={data.Content} />
            ) : data.__component === 'editor.youtube' ? (
              <YoutubeComponent link={data.Youtube} />
            ) : data.__component === 'editor.content' ? (
              <div
                className="w-full flex flex-col space-y-3 text-lg editor"
                dangerouslySetInnerHTML={{ __html: data.Content }}
              ></div>
            ) : data.__component === 'editor.drag-and-drop' ? (
              <div className="w-full flex flex-col space-y-6 editor">
                {process.browser && (
                  <DragDropContext
                    onDragEnd={(result) =>
                      onDragEnd(result, columns, setColumns)
                    }
                  >
                    {Object.entries(columns).map(
                      ([columnId, column], index) => {
                        return column.name === 'Drop' ? (
                          <Droppable
                            droppableId={columnId}
                            key={columnId}
                            isCombineEnabled={true}
                          >
                            {(provided, snapshot) => {
                              return (
                                <ol
                                  className="list-inside list-decimal drops"
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
                                          <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            dangerouslySetInnerHTML={{
                                              __html: item.Question,
                                            }}
                                          ></li>
                                        )
                                      }}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </ol>
                              )
                            }}
                          </Droppable>
                        ) : (
                          <div className="w-full" key={columnId}>
                            <div style={{ margin: 8 }}>
                              <Droppable droppableId={columnId} key={columnId}>
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      {...provided.droppableProps}
                                      ref={provided.innerRef}
                                      className="grid grid-cols-5 gap-6 w-full"
                                    >
                                      {column.items.map((item, index) => {
                                        return (
                                          <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}
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
                                        )
                                      })}
                                      {provided.placeholder}
                                    </div>
                                  )
                                }}
                              </Droppable>
                            </div>
                          </div>
                        )
                      },
                    )}
                  </DragDropContext>
                )}
              </div>
            ) : (
              <></>
            ),
          )}
          <YoutubeComponent link="https://youtu.be/QRkPhXI6tFo" />
          <TitleComponent title="B" content="Point of Language" />
          <div className="w-full flex flex-col space-y-3 text-lg">
            <p>
              An imperative sentence is basically, a sentence that gives a
              command or gives a request to do something. You can use imperative
              sentences
            </p>
            <p>
              to give a command or instruction, ask for something, or give
              advice. They tell people what to do.
            </p>
            <p className="font-bold">
              How do we know that it is an imperative sentence?
            </p>
            <p>
              The first sign that a sentence is in order is how it is
              punctuated. Most of these sentences end with a period, and
              sometimes with an exclamation mark. Just be careful, because, as
              you'll see below, a period or exclamation mark isn't the only way
              to end a sentence. Just look at the punctuation to see if you
              might be looking at an imperative sentence.
            </p>
            <p>
              Next, look at what these sentences say about the verbs. Most of
              the time, the first word in an imperative sentence is a verb that
              gives an order. The subject is another hint. Most of the time, the
              subject of a sentence that gives a direct order is not stated.
              Instead, it is assumed.
            </p>
            <p>
              The main purpose of an imperative sentence is to instruct, request
              or demand, invite, or give advice. Here are some examples of
              imperative sentences and their function.
            </p>
            <ul className="list-inside list-disc">
              <li>Turn on the power button. (instruction)</li>
              <li>Help me to fix my power-saving mode. (request or demand)</li>
              <li>Come with me to the computer exhibition. (invitation)</li>
            </ul>
          </div>
          <TitleComponent title="C" content="Practice" />
          <div className="w-full flex flex-col space-y-3">
            <p>
              Obviously, the amount of power a computer uses depends on the
              model and how it is used. For example, a laptop uses only a third
              as much energy as a desktop:
            </p>
            <p>
              On average, 200 Watt-hours are used by a full desktop (Wh). This
              is the average amount of power used by the computer (171 W), the
              internet modem (10 W), the printer (5 W), and the loudspeakers per
              hour (20 W). If a computer is on for eight hours a day, it will
              use 600 kWh of electricity in a year. That's the same as putting
              out about 175 kg of CO2 per year.
            </p>
            <p>
              A laptop uses a lot less power. Depending on the model, it uses
              between 50 and 100 Wh when it is on. If it is used for eight hours
              a day, it uses anywhere from 150 to 300 kWh per year. That's the
              same as putting out between 44 and 88 kg of CO2 per year.
            </p>
            <p>
              On standby, both a desktop and a laptop use about a third as much
              power as when they are being used. Putting the monitor into
              standby mode cuts its power use by 15%. If the monitor is
              completely turned off, it doesn't use any power.
            </p>
            <p>
              Even though the internet is a virtual place, using it still takes
              energy and causes CO2 to be released into the air. Consider it!
            </p>
            <p>Here are some tips to reduce computer power consumption!</p>
            <p>
              <span className="font-bold">Instruction:</span>
              <br /> Match the words in the boxes with the phrases below to make
              them into imperative sentences.
            </p>
          </div>
          {/* Drag and Drop Component */}
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
    </Layout>
  )
}

export async function getStaticProps() {
  const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/moduls?populate=deep`)
  const res = await req.json()

  return {
    props: {
      modul: res.data[0],
    },
  }
}
