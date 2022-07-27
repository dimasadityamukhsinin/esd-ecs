import Container from '@/components/modules/container'
import Header from '@/components/modules/header'
import Layout from '@/components/modules/layout'
import FancyLink from '@/components/utils/fancyLink'

export default function Account() {
  return (
    <Layout>
      <Header />
      <div className="w-full mt-4 md:mt-6 xl:mt-8 text-center font-medium">
        <h2>Your Account</h2>
      </div>
      <Container className="mt-4 md:mt-6 xl:mt-8 border-t bg-gray-50">
        <div className="w-full flex flex-col pt-8 pb-8">
          <div className="setflex-center-row space-x-8">
            <FancyLink destination="/account" className="border-b border-yellow-500 pb-2 text-yellow-500 text-xl font-medium">
              About you
            </FancyLink>
            <FancyLink destination="/account/email" className="pb-2 text-yellow-500 text-xl font-medium">
              Email address
            </FancyLink>
            <FancyLink destination="/account/password" className="pb-2 text-yellow-500 text-xl font-medium">
              Password
            </FancyLink>
          </div>
          <div className="flex flex-col max-w-md w-full mx-auto px-12 mt-12">
            <div className="flex flex-col">
              <span className="text-2xl font-medium">
                About you
              </span>
              <form className="mt-6">
                <div className="flex flex-col">
                  <div className="h-full w-full flex flex-col">
                    <label className="font-medium">
                      First Name *
                    </label>
                    <input
                      type="text"
                      className="w-full h-11 border p-2 mt-2"
                      value="Dimas Aditya"
                    />
                  </div>
                  <div className="h-full w-full mt-6 flex flex-col">
                    <label className="font-medium">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      className="w-full h-11 border p-2 mt-2"
                      value="Mukhsinin"
                    />
                  </div>
                </div>
                <FancyLink className="bg-yellow-400 w-full mt-6 text-white font-medium py-2 px-3">
                  Save changes
                </FancyLink>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  )
}