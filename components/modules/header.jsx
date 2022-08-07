import FancyLink from '@/components/utils/fancyLink'
import Container from '@/components/modules/container'
import { IoNotificationsOutline } from 'react-icons/io5'
import { useState } from 'react'

export default function Header({ className }) {
  const [reveal, setReveal] = useState({
    option: '',
    status: false,
  })
  return (
    <header className={`py-4 border-b w-full z-10 ${className}`}>
      <Container>
        <div className="flex justify-between items-center">
          <div className="w-full flex items-center">
            <FancyLink destination="/" className="font-medium text-xl">
              ESD in ECS
            </FancyLink>

            <FancyLink
              className="ml-8 text-yellow-500 font-medium text-xl"
              destination="/"
            >
              Your Learning
            </FancyLink>
          </div>

          <nav className="flex items-center space-x-5">
            <FancyLink destination="/" className="w-full h-full">
              <IoNotificationsOutline size={23} />
            </FancyLink>

            <div className="relative">
              <FancyLink
                onClick={() =>
                  setReveal({
                    option: 'profile',
                    status: !reveal.status,
                  })
                }
                className="bg-yellow-400 py-2 px-3 font-medium text-white"
              >
                DA
              </FancyLink>
              <div
                className={`absolute w-40 right-0 top-12 flex flex-col items-center space-y-3 p-6 text-sm bg-white border shadow-[0_1px_5px_1px_rgb(0_0_0_/_5%)] ${
                  reveal.status ? 'block' : 'hidden'
                }`}
              >
                <FancyLink
                  destination="/"
                  className="font-medium text-yellow-500"
                >
                  Your Learning
                </FancyLink>
                <FancyLink
                  destination="/account"
                  className="font-medium text-yellow-500"
                >
                  Account
                </FancyLink>
                <FancyLink
                  destination="/logout"
                  className="font-medium text-yellow-500"
                >
                  Sign out
                </FancyLink>
              </div>
            </div>
          </nav>
        </div>
      </Container>
    </header>
  )
}
