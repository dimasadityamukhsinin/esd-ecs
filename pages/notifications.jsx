import Container from '@/components/modules/container'
import Header from '@/components/modules/header'
import Layout from '@/components/modules/layout'
import FancyLink from '@/components/utils/fancyLink'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

export default function Notifications() {
  return (
    <Layout>
      <Header />
      <div className="w-full mt-4 md:mt-6 xl:mt-8 text-center font-medium">
        <h2>Notifications</h2>
      </div>
      <Container className="mt-12">
        <div className="w-full max-w-3xl flex flex-col items-center mx-auto">
          <FancyLink className="bg-yellow-400 py-2 px-3 text-white font-medium">
            Mark all as read
          </FancyLink>
          <div className="w-full flex flex-col mt-12 space-y-12">
            <div className="w-full flex flex-col border-b pb-5">
              <div className="w-full flex space-x-4">
                <AiOutlineQuestionCircle size={25} />
                <p>
                  FutureLearn would like to know what motivated you to join A
                  Beginner's Guide to C# and .NET
                </p>
                <span className="w-16 text-gray-500">20 JULI</span>
              </div>
              <div className="flex justify-end">
                <FancyLink className="text-yellow-500 font-medium">
                  Check your assignment
                </FancyLink>
              </div>
            </div>
            <div className="w-full flex flex-col border-b pb-5">
              <div className="w-full flex space-x-4">
                <AiOutlineQuestionCircle size={25} />
                <p>
                  FutureLearn would like to know what motivated you to join A
                  Beginner's Guide to C# and .NET
                </p>
                <span className="w-16 text-gray-500">20 JULI</span>
              </div>
              <div className="flex justify-end">
                <FancyLink className="text-yellow-500 font-medium">
                  Check your assignment
                </FancyLink>
              </div>
            </div>
            <div className="w-full flex flex-col border-b pb-5">
              <div className="w-full flex space-x-4">
                <AiOutlineQuestionCircle size={25} />
                <p>
                  FutureLearn would like to know what motivated you to join A
                  Beginner's Guide to C# and .NET
                </p>
                <span className="w-16 text-gray-500">20 JULI</span>
              </div>
              <div className="flex justify-end">
                <FancyLink className="text-yellow-500 font-medium">
                  Check your assignment
                </FancyLink>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  )
}
