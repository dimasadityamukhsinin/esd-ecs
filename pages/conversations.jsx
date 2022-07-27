import Container from '@/components/modules/container'
import Header from '@/components/modules/header'
import Layout from '@/components/modules/layout'
import FancyLink from '@/components/utils/fancyLink'
import { BsCheck2Square } from 'react-icons/bs'
import { BiConversation } from 'react-icons/bi'

export default function Conversations() {
  return (
    <Layout>
      <Header />
      <div className="setflex-center-row border-b py-6 space-x-8">
        <FancyLink destination="/" className="font-medium flex items-center">
          <BsCheck2Square size={20} className="mr-2" />
          Assignment
        </FancyLink>
        <FancyLink
          destination="/conversations"
          className="font-medium flex items-center"
        >
          <BiConversation size={20} className="mr-2" />
          Conversations
        </FancyLink>
      </div>
      <Container className="mt-4 md:mt-6 xl:mt-8">
        <div className="w-full my-12 max-w-3xl flex flex-col mx-auto">
          <span className="text-2xl font-medium">Assignment Conversations</span>
          <span className="mt-2">
            View and write a new comment from{' '}
            <span className="font-medium text-yellow-500">
              Reducing Computer Power Consumption
            </span>{' '}
            Modul
          </span>
          <div className="border-b w-full mt-6 pb-2">
            <span className="font-medium border-b border-black pb-2.5">
              Comments
            </span>
          </div>
          <div className="w-full h-40 flex mt-10 font-medium">
            <span className="h-[fit-content] p-2 mr-5 text-white bg-yellow-400">
              DA
            </span>
            <div className="w-full flex flex-col">
              <span className="mb-2">Dimas Aditya</span>
              <div className="w-full h-full border border-black"></div>
            </div>
          </div>
          <div className="flex flex-col w-full space-y-6">
            <div className="w-full border-b pb-6 flex mt-10">
              <span className="h-[fit-content] p-2 mr-5 text-white bg-yellow-400 font-medium">
                DA
              </span>
              <div className="w-full flex flex-col">
                <div className="flex justify-between">
                  <span className="mb-2 font-medium">Dimas Aditya</span>
                  <span className="text-gray-500">23 JULI</span>
                </div>
                <div className="w-full h-full">
                  <p>Ok</p>
                </div>
              </div>
            </div>
            <div className="w-full border-b pb-6 flex mt-10">
              <span className="h-[fit-content] p-2 mr-5 text-white bg-yellow-400 font-medium">
                DA
              </span>
              <div className="w-full flex flex-col">
                <div className="flex justify-between">
                  <span className="mb-2 font-medium">Dimas Aditya</span>
                  <span className="text-gray-500">23 JULI</span>
                </div>
                <div className="w-full h-full">
                  <p>Ok</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  )
}
