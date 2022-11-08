import { useCallback, useEffect } from 'react'
import { useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import FancyLink from '../utils/fancyLink'

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
    border = 'rounded-md border-2 border-blue-800'
  }
  return (
    <span
      ref={drop}
      name={`${question}_${name}_${idAnswer + 1}`}
      className={`text-blue-800 bg-white px-2 ${border}`}
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
      className="bg-blue-800 w-fit py-2 px-3 text-white text-center font-medium rounded-md"
    >
      {children}
    </span>
  )
}

const DragDrop = ({
  dragDrop,
  token,
  user,
  modul,
  modulId,
  modulCompleted = false,
  assessment = false,
}) => {
  const [remove, setRemove] = useState([])
  const [droppedBoxNames, setDroppedBoxNames] = useState([])
  const showButton = modulCompleted?.attributes.Question.find(
    (item) => item.Name === dragDrop.Name,
  )
    ? false
    : true

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

  const doSubmit = async (e) => {
    let dataAnswer = []
    let dataContent = []

    dragDrop.Drop.forEach((item) => {
      item.Content.forEach((e, id) => {
        if (e.Answer) {
          dataAnswer.push({
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

    const check = dataAnswer.filter(
      (item) => item.name.split('_')[0] === dragDrop.Name,
    )

    let content = []
    dragDrop.Drop.forEach((item) => {
      item.Content.forEach((e, id) => {
        if (e.Answer) {
          content.push({
            Name: item.Name,
            Key: check.find(
              (y) => y.name === `${dragDrop.Name}_${item.Name}_${id + 1}`,
            ).value,
            Answer:
              check
                .find(
                  (y) => y.name === `${dragDrop.Name}_${item.Name}_${id + 1}`,
                )
                .value.toLowerCase() === e.Content.toLowerCase(),
          })
        }
      })
    })

    dataContent.push({
      __component: 'question.drag-and-drop',
      Name: dragDrop.Name,
      Content: content,
      Score: Number.isInteger(
        (dragDrop.Point / dragDrop.Drag.length) *
          content.filter((item) => item.Answer === true).length,
      )
        ? (dragDrop.Point / dragDrop.Drag.length) *
          content.filter((item) => item.Answer === true).length
        : parseFloat(
            (dragDrop.Point / dragDrop.Drag.length) *
              content.filter((item) => item.Answer === true).length,
          ).toFixed(2),
    })

    if (modulCompleted) {
      dataContent.push(...modulCompleted.attributes.Question)
    }

    let Total_Score = 0

    dataContent.forEach((item) => {
      if(item.Name === dragDrop.Name) {
        if(assessment) {
          Total_Score = Total_Score + parseFloat(item.Score)
        }
      }else {
        Total_Score = Total_Score + parseFloat(item.Score)
      }
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

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-col space-y-6 p-4 mt-4 rounded-lg editor border-2 border-blue-800 h-[60vh] overflow-y-auto">
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
        <div className="w-full flex flex-col space-y-4">
          {dragDrop.Drop.map((item, id) => (
            <div
              id={`${dragDrop.Name}_${item.Name}`}
              className="w-full flex flex-col"
              key={id}
            >
              <div className="w-full grid grid-cols-12">
                <div className="outline-none col-span-2 lg:col-span-1 rounded-l-md border border-blue-800 flex justify-center items-center">
                  <span>{id + 1}</span>
                </div>
                <div className="w-full h-full p-3 leading-loose col-span-10 lg:col-span-11 rounded-r-md border-t border-b border-r border-blue-800 bg-blue-800 text-white">
                  {item.Content.map((i, idAnswer) =>
                    !i.Answer ? (
                      <span
                        name={`${dragDrop.Name}_${item.Name}_${idAnswer + 1}`}
                        key={idAnswer}
                      >
                        {i.Content}
                      </span>
                    ) : (
                      <>
                        &nbsp;
                        {modulCompleted?.attributes.Question.find(
                          (item) => item.Name === dragDrop.Name,
                        ) ? (
                          <span
                            className={`text-white px-2 rounded-md border-2 border-transparent ${
                              modulCompleted?.attributes.Question.find(
                                (item) => item.Name === dragDrop.Name,
                              ).Content[id].Answer
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            }`}
                          >
                            {
                              modulCompleted?.attributes.Question.find(
                                (item) => item.Name === dragDrop.Name,
                              ).Content[id].Key
                            }
                          </span>
                        ) : (
                          <Answer
                            key={idAnswer}
                            question={dragDrop.Name}
                            name={item.Name}
                            getDrop={getDrop}
                            idName={id++}
                            idAnswer={idAnswer}
                            idDrop={item.id}
                          />
                        )}
                        &nbsp;
                      </>
                    ),
                  )}
                </div>
              </div>
              {remove.length > 0 ? (
                remove.find((data) => data === item.id) && (
                  <div className="w-fit h-full mt-3 flex justify-center items-center">
                    <FancyLink
                      onClick={() => removeDrag(dragDrop.Name, item)}
                      className="font-medium text-white bg-red-500 w-full px-4 py-2 rounded-md"
                    >
                      Remove
                    </FancyLink>
                  </div>
                )
              ) : (
                <></>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end w-full mt-3">
        {showButton ? (
          <>
            <FancyLink
              onClick={() => resetDnd(dragDrop)}
              className="font-medium text-white bg-red-500 py-2 px-4 rounded-md"
            >
              Reset
            </FancyLink>
            <FancyLink
              onClick={doSubmit}
              className="font-medium text-white bg-blue-800 ml-4 py-2 px-4 rounded-md"
            >
              Submit
            </FancyLink>
          </>
        ) : (
          assessment && (
            <span className="font-medium text-blue-800">
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

export default DragDrop
