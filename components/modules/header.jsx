import FancyLink from '@/components/utils/fancyLink'
import Container from '@/components/modules/container'
import { IoNotificationsOutline } from 'react-icons/io5'
import { useState } from 'react'
import Image from 'next/image'
import nookies from 'nookies'
import { useRouter } from 'next/router'

export default function Header({ className, user, notif, logo, title }) {
  const [reveal, setReveal] = useState({
    option: '',
    status: false,
  })
  const route = useRouter()

  const logout = () => {
    nookies.destroy(null, 'token')
    route.replace('/login')
  }

  return (
    <>
      <header className={`relative py-4 border-b w-full z-20 ${className}`}>
        <Container className="flex flex-col">
          <div className="flex justify-between items-center">
            <div className="w-full flex items-center">
              <FancyLink destination="/" className="font-medium text-xl">
                <div className="relative w-12 h-12 aspect-square">
                  <Image
                    src={logo}
                    alt={title}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </FancyLink>

              <FancyLink
                className="ml-8 text-yellow-500 font-medium text-xl hidden md:block"
                destination="/"
              >
                Your Learning
              </FancyLink>
              <FancyLink
                className="ml-5 text-yellow-500 font-medium text-xl hidden md:block"
                destination="/about"
              >
                About
              </FancyLink>
            </div>

            <nav className="flex items-center space-x-5">
              <FancyLink
                destination="/notifications"
                className="relative w-full h-full"
              >
                <IoNotificationsOutline size={23} />
                {notif && (
                  <div className="absolute top-0 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </FancyLink>

              <div className="relative">
                <FancyLink
                  onClick={() =>
                    setReveal({
                      option: 'profile',
                      status: !reveal.status,
                    })
                  }
                  className="bg-yellow-400 py-2 px-3 w-10 font-medium text-white"
                >
                  {user.Full_Name.split('')[0]}
                </FancyLink>
                <div
                  className={`absolute w-36 right-0 top-12 flex flex-col items-center space-y-3 p-6 text-sm bg-white border shadow-[0_1px_5px_1px_rgb(0_0_0_/_5%)] ${
                    reveal.status ? 'block' : 'hidden'
                  }`}
                >
                  <FancyLink
                    destination="/account"
                    className="font-medium text-yellow-500"
                  >
                    Account
                  </FancyLink>
                  <FancyLink
                    onClick={logout}
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
      <div className="block md:hidden py-4 border-b w-full z-10">
        <Container className="flex items-start">
          <FancyLink
            className="text-yellow-500 font-medium text-xl"
            destination="/"
          >
            Your Learning
          </FancyLink>
          <FancyLink
            className="ml-8 text-yellow-500 font-medium text-xl"
            destination="/about"
          >
            About
          </FancyLink>
        </Container>
      </div>
    </>
  )
}
