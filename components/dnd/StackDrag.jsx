import { useDrag, useDrop } from 'react-dnd'
import update from 'immutability-helper'
import { useCallback, useState, useRef } from 'react'
import FancyLink from '../utils/fancyLink'

const Card = ({ id, text, index, moveCard, name, cardName }) => {
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
  return (
    <div
      ref={ref}
      name={`${name}_${cardName}`}
      className="w-full grid grid-cols-12"
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      <div className="outline-none rounded-l-md border border-green-400 flex justify-center items-center">
        <span>{index + 1}</span>
      </div>
      <div className="w-full h-full p-3 col-span-11 rounded-r-md border-t border-b border-r border-green-400 bg-green-400 text-white">
        <span>{text}</span>
      </div>
    </div>
  )
}

const StackDrag = ({ stack, modulCompleted, user, token, assessment }) => {
  const showButton = modulCompleted?.attributes.Question.find(
    (item) => item.Name === stack.Name,
  )
    ? false
    : true

  const [cards, setCards] = useState(stack.Drag)
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

    stack.Drag.forEach((item, id) => {
      let name = document.getElementById(`${stack.Name}`).children[id]
        .attributes.name.value
      dataAnswer.push({
        name: `${name}_to_${id + 1}`,
        value: stack.Drag.find(
          (e) =>
            parseInt(e.Name.split('-')[1]) ===
            parseInt(name.split('_')[1].split('-')[1]),
        ).Content,
      })
    })

    const check = dataAnswer.filter(
      (item) => item.name.split('_')[0] === stack.Name,
    )

    let content = []
    stack.Drag.forEach((_, id) => {
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
      Name: stack.Name,
      Content: content,
      Score: Number.isInteger(
        (stack.Point / stack.Drag.length) *
          content.filter((item) => item.Answer === true).length,
      )
        ? (stack.Point / stack.Drag.length) *
          content.filter((item) => item.Answer === true).length
        : parseFloat(
            (stack.Point / stack.Drag.length) *
              content.filter((item) => item.Answer === true).length,
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

  const renderCard = useCallback((card, index) => {
    return (
      <Card
        key={card.id}
        index={index}
        id={card.id}
        text={card.Content}
        cardName={card.Name}
        name={stack.Name}
        moveCard={moveCard}
      />
    )
  }, [])
  return (
    <div className="w-full flex flex-col">
      <div id={stack.Name} className="w-full flex flex-col space-y-4">
        {cards.map((card, i) =>
          modulCompleted?.attributes.Question.find(
            (item) => item.Name === stack.Name,
          ) ? (
            <div className="w-full min-h-[2.5rem] grid grid-cols-12">
              <div
                className={`outline-none rounded-l-md border flex justify-center items-center ${
                  modulCompleted?.attributes.Question.find(
                    (item) => item.Name === stack.Name,
                  ).Content[i].Answer
                    ? 'border-green-500'
                    : 'border-red-500'
                }`}
              >
                <span>{i + 1}</span>
              </div>
              <div
                className={`w-full h-full p-3 col-span-11 rounded-r-md border-t border-b border-r text-white ${
                  modulCompleted?.attributes.Question.find(
                    (item) => item.Name === stack.Name,
                  ).Content[i].Answer
                    ? 'border-green-500 bg-green-500'
                    : 'border-red-500 bg-red-500'
                }`}
              >
                <span>
                  {
                    modulCompleted?.attributes.Question.find(
                      (item) => item.Name === stack.Name,
                    ).Content[i].Content
                  }
                </span>
              </div>
            </div>
          ) : (
            renderCard(card, i)
          ),
        )}
      </div>
      <div className="flex justify-end w-full mt-3">
        {showButton ? (
          <FancyLink
            onClick={doSubmit}
            className="font-medium text-white bg-green-400 ml-4 py-2 px-4 rounded-md"
          >
            Submit
          </FancyLink>
        ) : (
          assessment && (
            <span className="font-medium text-green-400">
              Score{' '}
              {
                modulCompleted?.attributes.Question.find(
                  (item) => item.Name === arrange.Name,
                )?.Score
              }
            </span>
          )
        )}
      </div>
    </div>
  )
}

export default StackDrag
