import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { HTML5Backend } from 'react-dnd-html5-backend'
import update from 'immutability-helper'
const style = {
  display: 'inline-block',
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  backgroundColor: 'white',
  cursor: 'move',
}

function getStyle(backgroundColor) {
  return {
    border: '1px solid rgba(0,0,0,0.2)',
    minHeight: '8rem',
    minWidth: '8rem',
    color: 'white',
    backgroundColor,
    padding: '2rem',
    paddingTop: '1rem',
    margin: '1rem',
    textAlign: 'center',
    float: 'left',
    fontSize: '1rem',
  }
}

const Dustbin = ({ children }) => {
  const [lastDropped, setLastDropped] = useState(null)

  const [hasDropped, setHasDropped] = useState(false)
  const [{ isOver, isOverCurrent }, drop] = useDrop(
    () => ({
      accept: 'box',
      drop(_item, monitor) {
        setLastDropped(monitor.getItem().content)
        const didDrop = monitor.didDrop()
        if (didDrop) {
          return
        }
        setHasDropped(true)
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    }),
    [setHasDropped],
  )
  let backgroundColor = 'transparent'
  if (isOverCurrent || isOver) {
    backgroundColor = 'darkgreen'
  }
  return (
    <div ref={drop} className="inline-flex">
      <div style={{ backgroundColor: backgroundColor }}>{`${
        hasDropped ? lastDropped : `..........`
      }`}</div>
    </div>
  )
}

const Card = ({ id, text, index, moveCard }) => {
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
    <p ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
      {text.map((data) => (data ? data : <Dustbin />))}
    </p>
  )
}

const Box = ({ children }) => {
  const [, drag] = useDrag(() => ({
    type: 'box',
    item: {
      content: children,
    },
  }))
  return (
    <div ref={drag} style={style}>
      {children}
    </div>
  )
}

const Dnd2 = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      text: [
        'At first, it',
        null,
        'like a very small amount, but when you',
        'it by the number of people who can visit a site, like 100 million people a month, you',
        null,
        'a number that is the same as driving 80,000 km a day just to see the front page. The video',
        null,
        '80% of the data transferred these days. The more CO2 an image',
        null,
        ', the better it',
        null,
        '. Most of the remaining 20% comes from websites and emails. Because of the global COVID-19 pandemic, many people have had to work from home. This has led to a lot of digital innovations, but it has also led to more pollution.',
      ],
    },
    {
      id: 2,
      text: [
        'At first, it',
        null,
        'like a very small amount, but when you',
        'it by the number of people who can visit a site, like 100 million people a month, you',
        null,
        'a number that is the same as driving 80,000 km a day just to see the front page. The video',
        null,
        '80% of the data transferred these days. The more CO2 an image',
        null,
        ', the better it',
        null,
        '. Most of the remaining 20% comes from websites and emails. Because of the global COVID-19 pandemic, many people have had to work from home. This has led to a lot of digital innovations, but it has also led to more pollution.',
      ],
    },
  ])

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
        text={card.text}
        moveCard={moveCard}
      />
    )
  }, [])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 space-y-6">
        <div>
          <Box>Turn On</Box>
        </div>
        <div>
          <Box>Turn Off</Box>
        </div>

        {cards.map((card, i) => renderCard(card, i))}
      </div>
    </DndProvider>
  )
}

export default Dnd2
