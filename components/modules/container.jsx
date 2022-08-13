export default function Container({ children, className }) {
  return (
    <div
      className={`container px-5 md:px-10 max-w-screen-2xl mx-auto w-full ${className}`}
    >
      {children}
    </div>
  )
}
