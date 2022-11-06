import FancyLink from '../utils/fancyLink'

const FillLeftAnswer = ({ fill, modulCompleted, user, token, assessment }) => {
  const showButton = modulCompleted?.attributes.Question.find(
    (item) => item.Name === fill.Name,
  )
    ? false
    : true

  const doSubmit = async (e) => {
    let dataAnswer = []
    let dataContent = []

    fill.question_and_answer.forEach((_, id) => {
      dataAnswer.push({
        name: `${fill.Name}_${id + 1}`,
        value: document.getElementsByName(`${fill.Name}_${id + 1}`)[0].value,
      })
    })

    const check = dataAnswer.filter(
      (item) => item.name.split('_')[0] === fill.Name,
    )

    let content = []
    fill.question_and_answer.forEach((item, id) => {
      content.push({
        Key: check[id].value,
        Answer: check[id].value.toLowerCase() === item.Answer.toLowerCase(),
      })
    })
    dataContent.push({
      __component: 'question.fill-in-the-blank-left-answer',
      Name: fill.Name,
      Content: content,
      Score: Number.isInteger(
        (fill.Point / fill.question_and_answer.length) *
          content.filter((item) => item.Answer === true).length,
      )
        ? (fill.Point / fill.question_and_answer.length) *
          content.filter((item) => item.Answer === true).length
        : parseFloat(
            (fill.Point / fill.question_and_answer.length) *
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

  return (
    <div className="w-full flex flex-col">
      <div className="grid grid-cols-[2fr,1fr,2fr] grid-flow-col w-full border border-black">
        <div className="w-full border-r border-black h-full flex flex-col">
          {fill.question_and_answer.map((_, idLeft) =>
            idLeft !== 0 ? (
              modulCompleted?.attributes.Question.find(
                (item) => item.Name === fill.Name,
              ) ? (
                <input
                  key={idLeft}
                  className={`w-full pl-3 py-1 border-t border-black text-white outline-none ${
                    modulCompleted?.attributes.Question.find(
                      (item) => item.Name === fill.Name,
                    ).Content[idLeft].Answer
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                  value={
                    modulCompleted?.attributes.Question.find(
                      (item) => item.Name === fill.Name,
                    ).Content[idLeft].Key
                  }
                  readOnly
                />
              ) : (
                <input
                  key={idLeft}
                  onKeyDown={(e) => (e.keyCode === 32 ? false : true)}
                  onChange={(e) =>
                    (e.target.value = e.target.value.replace(/\s/g, ''))
                  }
                  name={`${fill.Name}_${idLeft + 1}`}
                  placeholder="..............."
                  className="w-full pl-3 py-1 border-t border-black placeholder:text-blue-800 text-blue-800 outline-none"
                />
              )
            ) : modulCompleted?.attributes.Question.find(
                (item) => item.Name === fill.Name,
              ) ? (
              <input
                key={idLeft}
                className={`w-full pl-3 py-1 text-white outline-none ${
                  modulCompleted?.attributes.Question.find(
                    (item) => item.Name === fill.Name,
                  ).Content[idLeft].Answer
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }`}
                value={
                  modulCompleted?.attributes.Question.find(
                    (item) => item.Name === fill.Name,
                  ).Content[idLeft].Key
                }
                readOnly
              />
            ) : (
              <input
                key={idLeft}
                onKeyDown={(e) => (e.keyCode === 32 ? false : true)}
                onChange={(e) =>
                  (e.target.value = e.target.value.replace(/\s/g, ''))
                }
                name={`${fill.Name}_${idLeft + 1}`}
                placeholder="..............."
                className="w-full pl-3 py-1 placeholder:text-blue-800 text-blue-800 outline-none"
              />
            ),
          )}
        </div>
        <div className="w-full flex justify-center items-center h-full">
          <span>{fill.Verb}</span>
        </div>
        <div className="w-full border-l border-black h-full flex flex-col">
          {fill.question_and_answer.map((item, idLeft) =>
            idLeft !== 0 ? (
              <div
                key={idLeft}
                className="w-full pl-3 py-1 border-t border-black"
              >
                {item.Question}
              </div>
            ) : (
              <div key={idLeft} className="w-full pl-3 py-1">
                {item.Question}
              </div>
            ),
          )}
        </div>
      </div>
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

export default FillLeftAnswer
