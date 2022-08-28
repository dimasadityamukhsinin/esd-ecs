import { useDrag, useDrop } from 'react-dnd'
import update from 'immutability-helper'
import { useCallback, useState, useRef } from 'react'

const Card = ({ id, text, index, moveCard, name, number }) => {
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
      className="w-full grid grid-cols-12"
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      <div className="outline-none rounded-l-md border border-yellow-400 flex justify-center items-center">
        <span>{index + 1}</span>
      </div>
      <div className="w-full h-full p-3 col-span-11 rounded-r-md border-t border-b border-r border-yellow-400 bg-yellow-400 text-white">
        <span name={`${name}_${number}`}>{text}</span>
      </div>
    </div>
  )
}

const StackDrag = ({ data, idComponent }) => {
  const [cards, setCards] = useState(data.Drag)
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
  const renderCard = useCallback((card, index) => {
    return (
      <Card
        key={card.id}
        index={index}
        id={card.id}
        text={card.Content}
        number={card.Number}
        name={data.Name}
        moveCard={moveCard}
      />
    )
  }, [])
  return cards.map((card, i) => renderCard(card, i))
}

export default StackDrag
