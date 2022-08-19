import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { memo, useCallback, useMemo, useState } from 'react'
import { HTML5Backend } from 'react-dnd-html5-backend'

const style = {
  border: '1px solid gray',
  height: '15rem',
  width: '15rem',
  padding: '2rem',
  textAlign: 'center',
}
const TargetBoxe = memo(function TargetBoxe({ onDrop, lastDroppedColor }) {
  const [{ isOver, draggingColor, canDrop }, drop] = useDrop(
    () => ({
      accept: ['yellow', 'blue'],
      drop(_item, monitor) {
        console.log(monitor.getItem())
        onDrop(monitor.getItemType())
        return undefined
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        draggingColor: monitor.getItemType(),
      }),
    }),
    [onDrop],
  )
  const opacity = isOver ? 1 : 0.7
  let backgroundColor = '#fff'
  switch (draggingColor) {
    case 'blue':
      backgroundColor = 'lightblue'
      break
    case 'yellow':
      backgroundColor = 'lightgoldenrodyellow'
      break
    default:
      break
  }
  return (
    <div
      ref={drop}
      data-color={lastDroppedColor || 'none'}
      style={{ ...style, backgroundColor, opacity }}
      role="TargetBox"
    >
      <p>Drop here.</p>

      {!canDrop && lastDroppedColor && <p>Last dropped: {lastDroppedColor}</p>}
    </div>
  )
})
const TargetBox = (props) => {
  const [lastDroppedColor, setLastDroppedColor] = useState(null)
  const handleDrop = useCallback((color) => setLastDroppedColor(color), [])
  return (
    <TargetBoxe
      {...props}
      lastDroppedColor={lastDroppedColor}
      onDrop={handleDrop}
    />
  )
}

const styles = {
  border: '1px dashed gray',
  padding: '0.5rem',
  margin: '0.5rem',
}
export const SourceBox = memo(function SourceBox({ color, children }) {
  const [forbidDrag, setForbidDrag] = useState(false)
  const [{ isDragging }, drag] = useDrag(
    () => ({
      item: {
        name: "woi"
      },
      type: color,
      canDrag: !forbidDrag,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [forbidDrag, color],
  )
  const onToggleForbidDrag = useCallback(() => {
    setForbidDrag(!forbidDrag)
  }, [forbidDrag, setForbidDrag])
  const backgroundColor = useMemo(() => {
    switch (color) {
      case 'yellow':
        return 'lightgoldenrodyellow'
      case 'blue':
        return 'lightblue'
      default:
        return 'lightgoldenrodyellow'
    }
  }, [color])
  const containerStyle = useMemo(
    () => ({
      ...styles,
      backgroundColor,
      opacity: isDragging ? 0.4 : 1,
      cursor: forbidDrag ? 'default' : 'move',
    }),
    [isDragging, forbidDrag],
  )
  return (
    <div ref={drag} style={containerStyle} role="SourceBox" data-color={color}>
      <input
        type="checkbox"
        checked={forbidDrag}
        onChange={onToggleForbidDrag}
      />
      <small>Forbid drag</small>
      {children}
    </div>
  )
})

const Dnd3 = memo(function Dnd3() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ overflow: 'hidden', clear: 'both', margin: '-.5rem' }}>
        <div style={{ float: 'left' }}>
          <SourceBox color="blue">
            <SourceBox color="yellow">
              <SourceBox color="yellow" />
              <SourceBox color="blue" />
            </SourceBox>
            <SourceBox color="blue">
              <SourceBox color="yellow" />
            </SourceBox>
          </SourceBox>
        </div>

        <div style={{ float: 'left', marginLeft: '5rem', marginTop: '.5rem' }}>
          <TargetBox />
        </div>
      </div>
    </DndProvider>
  )
})

export default Dnd3
