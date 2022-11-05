import { useCallback, useEffect, useRef } from 'react'
import { useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import FancyLink from '../utils/fancyLink'
import update from 'immutability-helper'

const Card = ({
  id,
  index,
  moveCard,
  dragDrop,
  cardData,
  droppedBoxNames,
  setDroppedBoxNames,
  remove,
  setRemove,
}) => {
  const ref = useRef(null)

  const [{ handlerId }, drop] = useDrop({
    accept: 'card',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })
  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: () => {
      return { id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  const opacity = isDragging ? 0 : 1
  drag(drop(ref))

  const getDrop = useCallback((e) => {
    setDroppedBoxNames((prev) => [...prev, e])
    document.getElementById(`dataDrag-${e.id}`).classList.add('hidden')
  }, [])

  const removeDrag = (question, item) => {
    droppedBoxNames.forEach((data) => {
      if (data.idDrop === item.id) {
        document
          .getElementById(`dataDrag-${data.id}`)
          .classList.remove('hidden')
      }
    })

    setDroppedBoxNames(
      droppedBoxNames.filter((data) => data.idDrop !== item.id),
    )
    item.Content.forEach((data, id) => {
      if (data.Answer) {
        document.getElementsByName(
          `${question}_${item.Name}_${id + 1}`,
        )[0].textContent = '..........'
        document
          .getElementsByName(`${question}_${item.Name}_${id + 1}`)[0]
          .classList.remove('pointer-events-none')
      }
    })
    setRemove(remove.filter((data) => data !== item.id))
  }

  return (
    <div
      ref={ref}
      name={`${dragDrop.Name}_${cardData.Name}`}
      className="w-full flex flex-col"
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      <div className="w-full grid grid-cols-12">
        <div className="outline-none col-span-2 lg:col-span-1 rounded-l-md border border-green-400 flex justify-center items-center">
          <span>{index + 1}</span>
        </div>
        <div className="w-full h-full p-3 leading-loose col-span-10 lg:col-span-11 rounded-r-md border-t border-b border-r border-green-400 bg-green-400 text-white">
          {cardData.Content.map((i, idAnswer) =>
            !i.Answer ? (
              <span
                name={`${dragDrop.Name}_${cardData.Name}_${idAnswer + 1}`}
                key={idAnswer}
              >
                {i.Content}
              </span>
            ) : (
              <>
                &nbsp;
                <Answer
                  key={idAnswer}
                  question={dragDrop.Name}
                  name={cardData.Name}
                  getDrop={getDrop}
                  idName={index + 1}
                  idAnswer={idAnswer}
                  idDrop={cardData.id}
                />
                &nbsp;
              </>
            ),
          )}
        </div>
      </div>
      {remove.length > 0 ? (
        remove.find((data) => data === cardData.id) && (
          <div className="w-fit h-full mt-3 flex justify-center items-center">
            <FancyLink
              onClick={() => removeDrag(dragDrop.Name, cardData)}
              className="font-medium text-white bg-green-400 w-full px-4 py-2 rounded-md"
            >
              Remove
            </FancyLink>
          </div>
        )
      ) : (
        <></>
      )}
    </div>
  )
}

const Answer = ({ question, name, idDrop, idAnswer, getDrop, idName }) => {
  const [{ isOver, isOverCurrent }, drop] = useDrop(
    () => ({
      accept: 'box',
      drop(_item, monitor) {
        let answer = document.getElementsByName(
          `${question}_${name}_${idAnswer + 1}`,
        )[0]
        answer.textContent = monitor.getItem().content
        setTimeout(() => {
          answer.classList.add('pointer-events-none')
        }, 10)
        getDrop({
          ...monitor.getItem(),
          idDrop,
          idAnswer,
        })
        const didDrop = monitor.didDrop()
        if (didDrop) {
          return
        }
      },
      collect: (monitor) => {
        return {
          isOver: monitor.isOver(),
          isOverCurrent: monitor.isOver({ shallow: true }),
        }
      },
    }),
    [],
  )
  let border = 'rounded-md border-2 border-transparent'
  if (isOverCurrent || isOver) {
    border = 'rounded-md border-2 border-green-500'
  }
  return (
    <span
      ref={drop}
      name={`${question}_${name}_${idAnswer + 1}`}
      className={`text-green-500 bg-white px-2 ${border}`}
    >
      ..........
    </span>
  )
}

const Box = ({ id, index, children }) => {
  const [, drag] = useDrag(() => ({
    type: 'box',
    item: {
      id: id,
      index: index,
      content: children,
    },
  }))
  return (
    <span
      ref={drag}
      id={`dataDrag-${id}`}
      className="bg-green-400 w-fit py-2 px-3 text-white text-center font-medium rounded-md"
    >
      {children}
    </span>
  )
}

const StackDragDrop = ({
  dragDrop,
  modulCompleted,
  user,
  token,
  assessment,
}) => {
  const [cards, setCards] = useState(dragDrop.Drop)
  const [remove, setRemove] = useState([])
  const [droppedBoxNames, setDroppedBoxNames] = useState([])
  const showButton = modulCompleted?.attributes.Question.find(
    (item) => item.Name === dragDrop.Name,
  )
    ? false
    : true

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setCards((prevCards) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      }),
    )
  }, [])

  const doSubmit = async (e) => {
    let dataAnswer = []
    let dataContent = []

    let dragDrop1 = []
    let stack1 = []

    dragDrop.Drop.forEach((item) => {
      item.Content.forEach((e, id) => {
        if (e.Answer) {
          dragDrop1.push({
            name: `${dragDrop.Name}_${item.Name}_${id + 1}`,
            value:
              document.getElementsByName(
                `${dragDrop.Name}_${item.Name}_${id + 1}`,
              )[0].innerText !== '..........'
                ? document.getElementsByName(
                    `${dragDrop.Name}_${item.Name}_${id + 1}`,
                  )[0].innerText
                : '',
          })
        }
      })
    })

    dragDrop.Drop.forEach((item, id) => {
      let name = document.getElementById(`${dragDrop.Name}`).children[id]
        .attributes.name.value
      stack1.push({
        name: `${name}_to_${id + 1}`,
        value: dragDrop.Drop.find(
          (e) =>
            parseInt(e.Name.split('-')[1]) ===
            parseInt(name.split('_')[1].split('-')[1]),
        )
          .Content.map((e) => e.Content)
          .join(' '),
      })
    })

    dataAnswer.push({
      name: dragDrop.Name,
      dragDrop: dragDrop1,
      stack: stack1,
      type: 'stack-with-drag-drop',
    })

    const check = dataAnswer.filter(
      (item) => item.name.split('_')[0] === dragDrop.Name,
    )

    let dataContents = []

    dragDrop.Drop.forEach((item) => {
      item.Content.forEach((e, id) => {
        if (e.Answer) {
          dataContents.push({
            Name: item.Name,
            Index: id,
            Key: check[0].dragDrop.find(
              (y) => y.name === `${dragDrop.Name}_${item.Name}_${id + 1}`,
            ).value,
            Answer:
              check[0].dragDrop
                .find(
                  (y) => y.name === `${dragDrop.Name}_${item.Name}_${id + 1}`,
                )
                .value.toLowerCase() === e.Content.toLowerCase(),
          })
        }
      })
    })

    let stack = []
    dragDrop.Drop.forEach((_, id) => {
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
      Name: dragDrop.Name,
      Drag_Drop: dataContents,
      Stack: stack,
      Score: Number.isInteger(
        (dragDrop.Point_Stack / dragDrop.Drop.length) *
          dataContents.filter((item) => item.Answer === true).length +
          (dragDrop.Point_Drop / dragDrop.Drag.length) *
            dataContents.filter((item) => item.Answer === true).length,
      )
        ? (dragDrop.Point_Stack / dragDrop.Drop.length) *
            dataContents.filter((item) => item.Answer === true).length +
          (dragDrop.Point_Drop / dragDrop.Drag.length) *
            dataContents.filter((item) => item.Answer === true).length
        : parseFloat(
            (dragDrop.Point_Stack / dragDrop.Drop.length) *
              dataContents.filter((item) => item.Answer === true).length +
              (dragDrop.Point_Drop / dragDrop.Drag.length) *
                dataContents.filter((item) => item.Answer === true).length,
          ).toFixed(2),
    })

    if (modulCompleted) {
      dataContent.push(...modulCompleted.attributes.Question)
    }

    let Total_Score = 0

    dataContent.forEach((item) => {
      Total_Score = Total_Score + parseFloat(item.Score)
    })

    let date = new Date()
    let dd = String(date.getDate()).padStart(2, '0')
    let mm = String(date.getMonth() + 1).padStart(2, '0') //January is 0!
    let yyyy = date.getFullYear()

    date = yyyy + '-' + mm + '-' + dd

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
              Question: dataContent,
              Date: date,
              Total_Score: Number.isInteger(Total_Score)
                ? Total_Score
                : parseFloat(Total_Score).toFixed(2),
              finish: false,
            },
          }),
        },
      ).then(() => {
        window.location.reload()
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
            idModule: modulId,
            idUser: user.id,
            User: user.Full_Name,
            Module_Name: modul.Title,
            Question: dataContent,
            Date: date,
            Total_Score: Number.isInteger(Total_Score)
              ? Total_Score
              : parseFloat(Total_Score).toFixed(2),
            finish: false,
          },
        }),
      }).then(() => {
        window.location.reload()
      })
    }
  }

  const renderCard = useCallback(
    (card, index) => {
      return (
        <Card
          key={card.id}
          index={index}
          id={card.id}
          dragDrop={dragDrop}
          cardData={card}
          moveCard={moveCard}
          droppedBoxNames={droppedBoxNames}
          setDroppedBoxNames={setDroppedBoxNames}
          remove={remove}
          setRemove={setRemove}
        />
      )
    },
    [remove, setRemove, droppedBoxNames, setDroppedBoxNames],
  )

  const resetDnd = (data) => {
    data.Drag.forEach((item) => {
      document.getElementById(`dataDrag-${item.id}`).classList.remove('hidden')
    })

    data.Drop.forEach((e) => {
      e.Content.forEach((item, id) => {
        if (item.Answer) {
          document.getElementsByName(
            `${data.Name}_${e.Name}_${id + 1}`,
          )[0].textContent = '..........'
          document
            .getElementsByName(`${data.Name}_${e.Name}_${id + 1}`)[0]
            .classList.remove('pointer-events-none')
        }
      })
    })
    setRemove([])
  }

  useEffect(() => {
    if (droppedBoxNames.length > 0) {
      if (remove.length > 0) {
        droppedBoxNames.forEach((data) => {
          remove.find((item) => item !== data.idDrop) &&
            setRemove((prev) => [...prev, data.idDrop])
        })
      } else {
        setRemove([droppedBoxNames[0].idDrop])
      }
    }
  }, [droppedBoxNames])

  let idName = 0

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-col space-y-6 p-4 mt-4 rounded-lg editor border-2 border-green-400 h-[80vh] overflow-y-auto">
        {!modulCompleted?.attributes.Question.find(
          (item) => item.Name === dragDrop.Name,
        ) && (
          <div className="flex flex-wrap drag">
            {dragDrop.Drag.map((item, idDrag) => (
              <Box
                key={idDrag}
                index={idDrag}
                id={item.id}
                children={item.Content}
              />
            ))}
          </div>
        )}
        <div className="w-full flex flex-col space-y-4" id={dragDrop.Name}>
          {cards.map((card, i) =>
            modulCompleted?.attributes.Question.find(
              (item) => item.Name === dragDrop.Name,
            ) ? (
              <div className="w-full flex flex-col">
                <div className="w-full grid grid-cols-12">
                  <div className="outline-none col-span-2 lg:col-span-1 rounded-l-md border border-green-400 flex justify-center items-center">
                    <span>{i + 1}</span>
                  </div>
                  <div className="w-full h-full p-3 leading-loose col-span-10 lg:col-span-11 rounded-r-md border-t border-b border-r border-green-400 bg-green-400 text-white">
                    {card.Content.map((i, idAnswer) =>
                      !i.Answer ? (
                        <span
                          name={`${dragDrop.Name}_${card.Name}_${idAnswer + 1}`}
                          key={idAnswer}
                        >
                          {i.Content}
                        </span>
                      ) : (
                        <>
                          &nbsp;
                          <span
                            className={`w-fit py-2 px-3 text-white text-center font-medium rounded-md ${
                              modulCompleted?.attributes.Question.find(
                                (item) => item.Name === dragDrop.Name,
                              ).Drag_Drop.filter((e) => e.Name === card.Name)
                                .find((e) => e.Index === idAnswer).Answer
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            }`}
                          >
                            {
                              modulCompleted?.attributes.Question.find(
                                (item) => item.Name === dragDrop.Name,
                              )
                                .Drag_Drop.filter((e) => e.Name === card.Name)
                                .find((e) => e.Index === idAnswer).Key
                            }
                          </span>
                          &nbsp;
                        </>
                      ),
                    )}
                  </div>
                </div>
                {remove.length > 0 ? (
                  remove.find((data) => data === cardData.id) && (
                    <div className="w-fit h-full mt-3 flex justify-center items-center">
                      <FancyLink
                        onClick={() => removeDrag(dragDrop.Name, cardData)}
                        className="font-medium text-white bg-green-400 w-full px-4 py-2 rounded-md"
                      >
                        Remove
                      </FancyLink>
                    </div>
                  )
                ) : (
                  <></>
                )}
              </div>
            ) : (
              renderCard(card, i)
            ),
          )}
        </div>
      </div>
      <div className="flex justify-end w-full mt-3">
        {showButton ? (
          <>
            <FancyLink
              onClick={() => resetDnd(dragDrop)}
              className="font-medium text-white bg-green-400 py-2 px-4 rounded-md"
            >
              Reset
            </FancyLink>
            <FancyLink
              onClick={doSubmit}
              className="font-medium text-white bg-green-400 ml-4 py-2 px-4 rounded-md"
            >
              Submit
            </FancyLink>
          </>
        ) : (
          assessment && (
            <span className="font-medium text-green-400">
              Score{' '}
              {
                modulCompleted?.attributes.Question.find(
                  (item) => item.Name === dragDrop.Name,
                )?.Score
              }
            </span>
          )
        )}
      </div>
    </div>
  )
}

export default StackDragDrop
