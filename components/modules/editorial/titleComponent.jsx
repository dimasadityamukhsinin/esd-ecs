const titleComponent = ({ title, content }) => {
  return (
    <>
      {/* Title Component */}
      <div className="w-full border-b-2 pb-3 text-xl">
        <span className="border py-0.5 px-1.5 mr-2 font-medium text-gray-500">
          {title}
        </span>
        <span className="font-medium text-gray-500">{content}</span>
      </div>
    </>
  )
}

export default titleComponent
