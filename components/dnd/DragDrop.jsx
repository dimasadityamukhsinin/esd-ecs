import { useCallback, useEffect } from 'react'
import { useState } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const Answer = ({ question, name, idDrop, idAnswer, getDrop, idName }) => {
  const [lastDropped, setLastDropped] = useState(null)
  const [hasDropped, setHasDropped] = useState(false)
  const [{ isOver, isOverCurrent }, drop] = useDrop(
    () => ({
      accept: 'box',
      drop(_item, monitor) {
        setLastDropped(monitor.getItem())
        getDrop({
          ...monitor.getItem(),
          idDrop,
          idAnswer,
        })
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
  let border = 'rounded-md border-2 border-transparent'
  if (isOverCurrent || isOver) {
    border = 'rounded-md border-2 border-yellow-500'
  }
  return (
    <span
      ref={drop}
      //   style={{ backgroundColor: backgroundColor }}
      name={`${question}_${name}_${idName + 1}`}
      className={`text-yellow-500 ${border} ${hasDropped ? 'pointer-events-none' : ''}`}
    >
      {`${hasDropped ? lastDropped.content : `..........`}`}
    </span>
  )
}

const Box = ({ id, children }) => {
  const [, drag] = useDrag(() => ({
    type: 'box',
    item: {
      id: id,
      content: children,
    },
  }))
  return (
    <span
      ref={drag}
      id={`dataDrag-${id}`}
      className="bg-yellow-400 w-fit py-2 px-3 text-white text-center font-medium rounded-md"
    >
      {children}
    </span>
  )
}

const DragDrop = ({ data, idComponent }) => {
  const [dragDrop, setDragDrop] = useState(data)
  const [droppedBoxNames, setDroppedBoxNames] = useState([])

  const getDrop = useCallback(
    (e) => {
      document.getElementById(`dataDrag-${e.id}`).remove()
      setDroppedBoxNames((prev) => [...prev, e])
    },
    [droppedBoxNames],
  )

  let idName = 0

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full flex flex-col space-y-6 p-4 mt-4 rounded-lg editor border-2 border-yellow-400">
        <div className="flex flex-wrap drag">
          {dragDrop.Drag.map((item, idDrag) => (
            <Box key={idDrag} id={item.id} children={item.Content} />
          ))}
        </div>
        <ol
          className={`list-inside list-decimal space-y-4 drops-${idComponent}`}
        >
          {dragDrop.Drop.map((item, id) => {
            idName = 0
            return (
              <li key={id}>
                <div className="inline max-w-md">
                  {item.Content.map((i, idAnswer) =>
                    i ? (
                      <span>{i}</span>
                    ) : (
                      <>
                        &nbsp;
                        <Answer
                          question={dragDrop.Name}
                          name={item.Name}
                          getDrop={getDrop}
                          idName={idName++}
                          idAnswer={idAnswer}
                          idDrop={item.id}
                        />
                        &nbsp;
                      </>
                    ),
                  )}
                </div>
                {/* {checkDrop
                .filter((data) => data.id === idComponent)
                .find((item) => item.index === id) && (
                <FancyLink
                  onClick={() => removeDrag(idComponent, id, item)}
                  className="ml-6 rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-white"
                >
                  Remove
                </FancyLink>
              )} */}
              </li>
            )
          })}
        </ol>
      </div>
    </DndProvider>
  )
}

export default DragDrop
