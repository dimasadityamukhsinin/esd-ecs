import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { memo, useCallback, useMemo, useState } from 'react'
import { HTML5Backend } from 'react-dnd-html5-backend'
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
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 space-y-6">
        <div>
          <Box>Turn On</Box>
        </div>
        <div>
          <Box>Turn Off</Box>
        </div>
        <p>
          At first, it <Dustbin />
          {` `}like a very small amount, but when you <Dustbin />
          {` `}
          it by the number of people who can visit a site, like 100 million
          people a month, you <Dustbin />
          {` `}a number that is the same as driving 80,000 km a day just to see
          the front page. The video <Dustbin />
          {` `}80% of the data transferred these days. The more CO2 an image{' '}
          <Dustbin />
          {` `}, the better it <Dustbin />
          {` `}Most of the remaining 20% comes from websites and emails. Because
          of the global COVID-19 pandemic, many people have had to work from
          home. This has led to a lot of digital innovations, but it has also
          led to more pollution.
          {/* <Dustbin>your sleep setting.</Dustbin> */}
        </p>
      </div>
    </DndProvider>
  )
}

export default Dnd2
