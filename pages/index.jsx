import { useRef, useEffect } from 'react'
import Layout from '@/components/modules/layout'
import Container from '@/components/modules/container'
import Header from '@/components/modules/header'
import FancyLink from '@/components/utils/fancyLink'
import Image from 'next/image'

export default function Home({ modul }) {
  const countdownData = (date) => {
    let today = new Date().toISOString().slice(0, 10)

    const startDate = date
    const endDate = today

    const diffInMs = new Date(startDate) - new Date(endDate)
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
    return `${diffInDays} days left`
  }

  return (
    <Layout>
      <Header />
      <div className="w-full my-8 text-center font-medium">
        <h2>Your Learning</h2>
      </div>
      <div className="border-t bg-gray-50 w-full">
        <Container className="mt-4 md:mt-6 xl:mt-8">
          <div className="flex space-x-8 mt-12 ml-[0.7rem]">
            <FancyLink
              destination="/"
              className="border-b border-yellow-500 pb-2 text-yellow-500 text-xl font-medium"
            >
              Assignment
            </FancyLink>
            <FancyLink
              destination="/missed"
              className="pb-2 text-yellow-500 text-xl font-medium"
            >
              Missed
            </FancyLink>
            <FancyLink
              destination="/completed"
              className="pb-2 text-yellow-500 text-xl font-medium"
            >
              Completed
            </FancyLink>
          </div>
          <div className="flex flex-wrap test mt-6">
            {modul.map(({ attributes }, id) => (
              <FancyLink
                key={id}
                destination="/contoh1"
                className="relative bg-white border w-96"
              >
                <span className="absolute top-0 right-0 z-20 mt-2 mr-3 text-white font-medium">
                  {countdownData(attributes.Assignment_Deadline)}
                </span>
                <div className="relative flex justify-center w-full h-52">
                  <Image
                    src={`${process.env.API_URL}${attributes.Thumbnail.data.attributes.url}`}
                    alt={attributes.title}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute z-10 w-full h-full bg-black opacity-40" />
                  <hr className="absolute bottom-0 z-20 mb-3 w-11/12 px-4 bg-white" />
                </div>
                <div className="w-full flex flex-col p-3 space-y-3">
                  <span className='font-medium text-gray-500'>Modul {id+1}</span>
                  <span className="font-medium text-lg text-left">
                    {attributes.Title}
                  </span>
                  <p className="text-gray-500 font-medium text-sm text-left">
                    {attributes.Short_Description}
                  </p>
                  <div className="bg-yellow-400 w-full mt-6 text-center text-white font-medium py-2 px-3">
                    Go to modul
                  </div>
                </div>
              </FancyLink>
            ))}
          </div>
        </Container>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const req = await fetch(`${process.env.API_URL}/api/moduls?populate=deep`)
  const res = await req.json()

  return {
    props: {
      modul: res.data,
    },
  }
}
