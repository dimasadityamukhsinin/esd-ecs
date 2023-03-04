import { useEffect } from 'react'
import FancyLink from '../utils/fancyLink'

const Essay = ({
  essay,
  token,
  user,
  modul,
  modulId,
  modulCompleted = false,
  assessment = false,
}) => {
  const showButton = modulCompleted?.attributes.Question.find(
    (item) => item.Name === essay.Name,
  )
    ? false
    : true

  const doSubmit = async (e) => {
    let dataAnswer = []
    let dataContent = []

    essay.Question.forEach((item) => {
      item.Content.forEach((e, id) => {
        if (e.Answer) {
          dataAnswer.push({
            name: `${essay.Name}_${item.Name}_${id + 1}`,
            value: document.getElementsByName(
              `${essay.Name}_${item.Name}_${id + 1}`,
            )[1].value,
          })
        }
      })
    })

    const check = dataAnswer.filter(
      (item) => item.name.split('_')[0] === essay.Name,
    )

    let content = []
    essay.Question.forEach((item) => {
      item.Content.forEach((e, id) => {
        if (e.Answer) {
          content.push({
            Name: item.Name,
            Index: id,
            Key: check.find(
              (y) => y.name === `${essay.Name}_${item.Name}_${id + 1}`,
            ).value,
            Answer:
              check
                .find((y) => y.name === `${essay.Name}_${item.Name}_${id + 1}`)
                .value.toLowerCase() === e.Content.toLowerCase(),
          })
        }
      })
    })

    dataContent.push({
      __component: 'question.essay',
      Name: essay.Name,
      Content: content,
      Score: Number.isInteger(
        (essay.Point / essay.Question.length) *
          content.filter((item) => item.Answer === true).length,
      )
        ? (essay.Point / essay.Question.length) *
          content.filter((item) => item.Answer === true).length
        : parseFloat(
            (essay.Point / essay.Question.length) *
              content.filter((item) => item.Answer === true).length,
          ).toFixed(2),
    })

    if (modulCompleted) {
      dataContent.push(...modulCompleted.attributes.Question)
    }

    let Total_Score = 0

    dataContent.forEach((item) => {
      if (item.Name === essay.Name) {
        if (assessment) {
          Total_Score = Total_Score + parseFloat(item.Score)
        }
      } else {
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

  const updateSizeChange = (name) => {
    const span = document.getElementsByName(name)
    const input = document.getElementsByName(name)
    span[0].innerText = `${input[1].value}`
  }

  const doChangeInput = (e, name) => {
    const input = document.getElementsByName(name)
    input[1].oninput = updateSizeChange(name)

    // Provide some initial content
    input[1].value = e.target.value.replace(/\s/g, '')
    updateSizeChange(name)
  }

  const updateSize = (name) => {
    const span = document.getElementsByName(name)
    const input = document.getElementsByName(name)
    span[0].innerText = input[1].value
    input[1].value = ''
  }

  useEffect(() => {
    if (
      !modulCompleted?.attributes.Question.find(
        (item) => item.Name === essay.Name,
      )
    )
      essay.Question.forEach((item) => {
        item.Content.forEach((i, idAnswer) => {
          if (i.Answer) {
            const input = document.getElementsByName(
              `${essay.Name}_${item.Name}_${idAnswer + 1}`,
            )
            input[1].oninput = updateSize(
              `${essay.Name}_${item.Name}_${idAnswer + 1}`,
            )

            // Provide some initial content
            input[1].value = '...............'
            updateSize(`${essay.Name}_${item.Name}_${idAnswer + 1}`)
          }
        })
      })
  }, [])

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col w-full space-y-4">
        {essay.Question.map((item, id) => (
          <div className="w-full grid grid-cols-12" key={id}>
            <div className="outline-none col-span-2 lg:col-span-1 rounded-l-md border border-blue-800 flex justify-center items-center">
              <span>{id + 1}</span>
            </div>
            <div className="w-full h-full p-3 leading-loose col-span-10 lg:col-span-11 rounded-r-md border-t border-b border-r border-blue-800 bg-blue-800 text-white">
              {item.Content.map((i, idAnswer) =>
                !i.Answer ? (
                  <span
                    name={`${essay.Name}_${item.Name}_${idAnswer + 1}`}
                    key={idAnswer}
                  >
                    {i.Content}
                  </span>
                ) : (
                  <>
                    &nbsp;
                    <div className="relative inline-block min-w-[4em]">
                      {modulCompleted?.attributes.Question.find(
                        (item) => item.Name === essay.Name,
                      ) ? (
                        <span
                          className={`block w-full py-1 px-2 rounded-md text-center text-white ${
                            modulCompleted?.attributes.Question.find(
                              (item) => item.Name === essay.Name,
                            )
                              .Content.filter((e) => e.Name === item.Name)
                              .find((e) => e.Index === idAnswer).Answer
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          }`}
                        >
                          {
                            modulCompleted?.attributes.Question.find(
                              (item) => item.Name === essay.Name,
                            )
                              .Content.filter((e) => e.Name === item.Name)
                              .find((e) => e.Index === idAnswer).Key
                          }
                        </span>
                      ) : (
                        <>
                          <span
                            name={`${essay.Name}_${item.Name}_${idAnswer + 1}`}
                            className="invisible whitespace-pre pl-3"
                          ></span>
                          <input
                            name={`${essay.Name}_${item.Name}_${idAnswer + 1}`}
                            onChange={(e) =>
                              doChangeInput(
                                e,
                                `${essay.Name}_${item.Name}_${idAnswer + 1}`,
                              )
                            }
                            placeholder="..............."
                            maxLength="15"
                            className={`absolute left-0 w-full text-blue-800 bg-white px-2 rounded-md outline-none placeholder:text-blue-800`}
                          />
                        </>
                      )}
                    </div>
                    &nbsp;
                  </>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
      {modulCompleted?.attributes.Question.find(
        (item) => item.Name === essay.Name,
      ) && !assessment ? (
        <div className="w-full flex flex-col mt-6 border-2 border-green-500 rounded-lg p-5">
          <span className="mb-6 text-green-500 font-bold">
            The Correct Answer :
          </span>
          <div className="flex flex-col w-full space-y-4">
            {essay.Question.map((item, id) => (
              <div className="w-full grid grid-cols-12" key={id}>
                <div className="outline-none col-span-2 lg:col-span-1 rounded-l-md border border-blue-800 flex justify-center items-center">
                  <span>{id + 1}</span>
                </div>
                <div className="w-full h-full p-3 leading-loose col-span-10 lg:col-span-11 rounded-r-md border-t border-b border-r border-blue-800 bg-blue-800 text-white">
                  {item.Content.map((i, idAnswer) =>
                    !i.Answer ? (
                      <span
                        name={`${essay.Name}_${item.Name}_${idAnswer + 1}`}
                        key={idAnswer}
                      >
                        {i.Content}
                      </span>
                    ) : (
                      <>
                        &nbsp;
                        <div className="relative inline-block min-w-[4em]">
                          <span
                            className={`block w-full py-1 px-2 rounded-md text-center text-white bg-green-500`}
                          >
                            {
                              i.Content
                            }
                          </span>
                        </div>
                        &nbsp;
                      </>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="flex justify-end w-full mt-3">
        {showButton ? (
          <FancyLink
            onClick={doSubmit}
            className="font-medium text-white bg-blue-800 ml-4 py-2 px-4 rounded-md"
          >
            Submit
          </FancyLink>
        ) : (
          assessment && (
            <span className="font-medium text-blue-800">
              Score{' '}
              {
                modulCompleted?.attributes.Question.find(
                  (item) => item.Name === essay.Name,
                )?.Score
              }
            </span>
          )
        )}
      </div>
    </div>
  )
}

export default Essay
