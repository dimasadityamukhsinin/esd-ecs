import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const data = [
  {
    id: '1234',
    name: 'Apple',
  },
  {
    id: '4321',
    name: 'Google',
  },
  {
    id: '3241',
    name: 'Microsoft',
  },
  {
    id: '9876',
    name: 'Uber',
  },
  {
    id: '7586',
    name: 'Twilio',
  },
]

const Item = ({ className, name }) => (
  <div className="">{name}</div>
)
const Test = () => {
  const [dragOverId, setdragOverId] = useState(null)
  const [isDraggable, setisDraggable] = useState(false)
  const [items, setItems] = useState(data)

  const handleDragUpdate = ({ combine }) => {
    setdragOverId(combine ? combine?.draggableId : combine)
  }

  const combine = (origin, destiny) => ({
    id: destiny.id,
    name: `${destiny.name}, ${origin.name}`,
  })

  const handleCombine = (originPos, destinyId) => {
    const newItems = Array.from(items)
    const origin = newItems[originPos]
    const destinyPos = newItems.findIndex(({ id }) => id === destinyId)
    const destiny = newItems[destinyPos]
    const combinedItem = combine(origin, destiny)

    newItems.splice(destinyPos, 1, combinedItem)
    newItems.splice(originPos, 1)
    console.log(newItems)

    setItems(newItems)
  }

  const handleDragEnd = ({ source, combine }) => {
    if (combine) {
      const { index } = source
      const { draggableId } = combine

      handleCombine(index, draggableId)
    }
    setdragOverId(null)
  }

  const checkIsDraggable = (snapshot) => {
    const { isDragging, draggingOver } = snapshot

    if (isDragging && !draggingOver) {
      setisDraggable(false)
    }
  }

  const getItemStyle = (draggableStyle) => {
    const { transform } = draggableStyle
    let activeTransform = {}

    if (transform) {
      activeTransform = {
        transform: `translate(0, ${transform.substring(
          transform.indexOf(',') + 1,
          transform.indexOf(')'),
        )})`,
      }
    }
    return {
      userSelect: 'none',
      ...draggableStyle,
      ...activeTransform,
    }
  }

  //   const { className, items, itemComponent: Item } = this.props

  return (
    <DragDropContext onDragUpdate={handleDragUpdate} onDragEnd={handleDragEnd}>
      <Droppable droppableId="list-unique-id" isCombineEnabled>
        {({ innerRef, droppableProps, placeholder }) => {
          return (
            <ul className="" ref={innerRef} {...droppableProps}>
              {items.map((item, index) => (
                <Draggable
                  draggableId={item.id}
                  index={index}
                  isDraggable={isDraggable}
                >
                  {(
                    { innerRef, draggableProps, dragHandleProps },
                    snapshot,
                  ) => {
                    if (isDraggable) {
                      this.checkIsDraggable(snapshot)
                    }
                    return (
                      <li
                        key={item.id}
                        className=""
                        ref={innerRef}
                        {...draggableProps}
                        {...dragHandleProps}
                        style={getItemStyle(draggableProps.style)}
                      >
                        <Item className="" {...item} index={index} />
                      </li>
                    )
                  }}
                </Draggable>
              ))}
              {placeholder}
            </ul>
          )
        }}
      </Droppable>
    </DragDropContext>
  )
}

export default Test
