import { useRef, useEffect } from 'react'
import Layout from '@/components/modules/layout'
import Container from '@/components/modules/container'
import Header from '@/components/modules/header'
import FancyLink from '@/components/utils/fancyLink'
import Image from 'next/image'

export default function Completed() {
  return (
    <Layout>
      <Header />
      <div className="w-full mt-4 md:mt-6 xl:mt-8 text-center font-medium">
        <h2>Your Learning</h2>
      </div>
      <Container className="mt-4 md:mt-6 xl:mt-8 border-t bg-gray-50">
        <div className="flex space-x-8 mt-12 ml-[0.7rem]">
          <FancyLink
            destination="/"
            className="pb-2 text-yellow-500 text-xl font-medium"
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
            className="border-b border-yellow-500 pb-2 text-yellow-500 text-xl font-medium"
          >
            Completed
          </FancyLink>
        </div>
        <div className="flex flex-wrap test mt-6">
          <FancyLink className="relative bg-white border w-96">
            <span className="absolute top-0 right-0 z-20 mt-2 mr-3 text-white font-medium">
                80 / 100
            </span>
            <div className="relative flex justify-center w-full h-40">
              <Image src="/tes.jpg" layout="fill" objectFit="cover" />
              <div className="absolute z-10 w-full h-full bg-black opacity-40" />
              <hr className="absolute bottom-0 z-20 mb-3 w-11/12 px-4 bg-white" />
            </div>
            <div className="w-full flex flex-col p-3 space-y-3">
              <span className="font-medium text-lg text-left">
                Reducing Computer Power Consumption
              </span>
              <p className="text-gray-500 font-medium text-sm text-left">
                An imperative sentence is basically, a sentence that gives a
                command or gives a request to do something. You can use
                imperative sentences to give a command or instruction, ask for
                something, or give advice. They tell people what to do.
              </p>
              <div className="bg-yellow-400 w-full mt-6 text-white font-medium py-2 px-3">
                Go to modul
              </div>
            </div>
          </FancyLink>
        </div>
      </Container>
    </Layout>
  )
}
