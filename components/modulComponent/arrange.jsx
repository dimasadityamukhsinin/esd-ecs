import FancyLink from '../utils/fancyLink'

const Arrange = ({
  arrange,
  token,
  user,
  modul,
  modulId,
  modulCompleted = false,
  assessment = false,
}) => {
  const showButton = modulCompleted?.attributes.Question.find(
    (item) => item.Name === arrange.Name,
  )
    ? false
    : true

  const doSubmit = async (e) => {
    let dataAnswer = []
    let dataContent = []

    arrange.Arrange.forEach((_, id) => {
      dataAnswer.push({
        name: `${arrange.Name}_${id + 1}`,
        value: document.getElementsByName(`${arrange.Name}_${id + 1}`)[0].value,
      })
    })

    const check = dataAnswer.filter(
      (item) => item.name.split('_')[0] === arrange.Name,
    )

    let content = []
    arrange.Arrange.forEach((item, id) => {
      content.push({
        Key: check[id].value,
        Answer: parseInt(check[id].value) === parseInt(item.Number),
      })
    })
    dataContent.push({
      __component: 'question.arrange',
      Name: arrange.Name,
      Content: content,
      Score: Number.isInteger(
        (arrange.Point / arrange.Arrange.length) *
          content.filter((item) => item.Answer === true).length,
      )
        ? (arrange.Point / arrange.Arrange.length) *
          content.filter((item) => item.Answer === true).length
        : parseFloat(
            (arrange.Point / arrange.Arrange.length) *
              content.filter((item) => item.Answer === true).length,
          ).toFixed(2),
    })

    if (modulCompleted) {
      dataContent.push(...modulCompleted.attributes.Question)
    }

    let Total_Score = 0

    dataContent.forEach((item) => {
      if (item.Name === arrange.Name) {
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

  return (
    <div className="w-full flex flex-col">
      <div className="w-full grid grid-cols-3 gap-6">
        {arrange.Arrange.map((item, idArrange) =>
          modulCompleted?.attributes.Question.find(
            (item) => item.Name === arrange.Name,
          ) ? (
            <div
              key={idArrange}
              className="w-full grid grid-cols-4 grid-flow-col"
            >
              <div
                className={`w-full h-full p-1 border-t border-l border-b rounded-l-md col-span-3 flex justify-center items-center ${
                  modulCompleted?.attributes.Question.find(
                    (item) => item.Name === arrange.Name,
                  ).Content[idArrange].Answer
                    ? 'border-green-500'
                    : 'border-red-500'
                }`}
              >
                <span>{item.Content}</span>
              </div>
              <input
                type="number"
                className={`outline-none text-center border rounded-r-md pointer-events-none text-white ${
                  modulCompleted?.attributes.Question.find(
                    (item) => item.Name === arrange.Name,
                  ).Content[idArrange].Answer
                    ? 'border-green-500 bg-green-500'
                    : 'border-red-500 bg-red-500'
                }`}
                value={
                  modulCompleted?.attributes.Question.find(
                    (item) => item.Name === arrange.Name,
                  ).Content[idArrange].Key
                }
                readOnly
              />
            </div>
          ) : (
            <div
              key={idArrange}
              className="w-full grid grid-cols-4 grid-flow-col"
            >
              <div className="w-full h-full p-1 border-t border-l border-b rounded-l-md border-blue-800 col-span-3 flex justify-center items-center">
                <span>{item.Content}</span>
              </div>
              <input
                type="number"
                name={`${arrange.Name}_${idArrange + 1}`}
                className="outline-none text-center border rounded-r-md bg-blue-800 text-white border-blue-800"
              />
            </div>
          ),
        )}
      </div>
      {modulCompleted?.attributes.Question.find(
        (item) => item.Name === arrange.Name,
      ) && !assessment ? (
        <div className="w-full flex flex-col mt-6 border-2 border-green-500 rounded-lg p-5">
          <span className="mb-6 text-green-500 font-bold">
            The Correct Answer :
          </span>
          <div className="w-full grid grid-cols-3 gap-6">
            {arrange.Arrange.map((item, idArrange) => (
              <div
                key={idArrange}
                className="w-full grid grid-cols-4 grid-flow-col"
              >
                <div
                  className={`w-full h-full p-1 border-t border-l border-b rounded-l-md col-span-3 flex justify-center items-center border-blue-800`}
                >
                  <span>{item.Content}</span>
                </div>
                <input
                  type="number"
                  className={`outline-none text-center border rounded-r-md pointer-events-none text-white border-blue-800 bg-blue-800`}
                  value={item.Number}
                  readOnly
                />
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

export default Arrange
