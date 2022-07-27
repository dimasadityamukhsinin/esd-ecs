import getYoutube from '@/helpers/getYoutube'

const YoutubeComponent = ({ link }) => {
  return (
    <>
      {/* Youtube Component */}
      <div
        className={`relative w-full h-full aspect-w-16 aspect-h-9 max-md:aspect-w-1 max-md:aspect-h-1`}
        style={{
          backgroundColor: `rgba(208,208,208, 1)`,
        }}
      >
        <>
          <iframe
            src={'https://www.youtube.com/embed/' + getYoutube(link)}
            id="videos"
            width="100%"
            height="100%"
          />
        </>
      </div>
    </>
  )
}

export default YoutubeComponent
