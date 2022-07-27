import FancyLink from '@/components/utils/fancyLink'
import Container from '@/components/modules/container'
import { IoNotificationsOutline } from 'react-icons/io5'

export default function Header({ className }) {
  return (
    <header className={`py-4 border-b w-full z-10 ${className}`}>
      <Container>
        <div className="flex justify-between items-center">
          <div className="w-full flex items-center">
            <FancyLink destination="/" className="font-medium text-xl">
              ESD in ECS
            </FancyLink>

            <FancyLink className="ml-8 text-yellow-500 font-medium text-xl" destination="/assigment">
              Your Learning
            </FancyLink>
          </div>

          <nav className="flex items-center space-x-5">
            <FancyLink destination="/" className="w-full h-full">
              <IoNotificationsOutline size={23} />
            </FancyLink>

            <FancyLink className="bg-yellow-400 py-2 px-3 font-medium text-white">
              DA
            </FancyLink>
          </nav>
        </div>
      </Container>
    </header>
  )
}
