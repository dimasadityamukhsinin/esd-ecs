import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'

const Column = (props) => {
  const title = props.title
  const quotes = props.quotes
  const index = props.index
  return (
    <Draggable draggableId={title} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <div isDragging={snapshot.isDragging}>
            <h4
              isDragging={snapshot.isDragging}
              {...provided.dragHandleProps}
              aria-label={`${title} quote list`}
            >
              {title}
            </h4>
          </div>
          {/* <QuoteList
            listId={title}
            listType="QUOTE"
            style={{
              backgroundColor: snapshot.isDragging ? "#000" : null,
            }}
            quotes={quotes}
            internalScroll={props.isScrollable}
            isCombineEnabled={Boolean(props.isCombineEnabled)}
            useClone={Boolean(props.useClone)}
          /> */}
          <Droppable
            droppableId={title}
            type="QUOTE"
            // ignoreContainerClipping={ignoreContainerClipping}
            isDropDisabled={isDropDisabled}
            isCombineEnabled={isCombineEnabled}
            renderClone={
              useClone
                ? (provided, snapshot, descriptor) => (
                    <QuoteItem
                      quote={quotes[descriptor.source.index]}
                      provided={provided}
                      isDragging={snapshot.isDragging}
                      isClone
                    />
                  )
                : null
            }
          >
            {(dropProvided, dropSnapshot) => (
              <Wrapper
                style={style}
                isDraggingOver={dropSnapshot.isDraggingOver}
                isDropDisabled={isDropDisabled}
                isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
                {...dropProvided.droppableProps}
              >
                {internalScroll ? (
                  <ScrollContainer style={scrollContainerStyle}>
                    <InnerList
                      quotes={quotes}
                      title={title}
                      dropProvided={dropProvided}
                    />
                  </ScrollContainer>
                ) : (
                  <InnerList
                    quotes={quotes}
                    title={title}
                    dropProvided={dropProvided}
                  />
                )}
              </Wrapper>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  )
}

export default Column
