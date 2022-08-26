import Container from '@/components/modules/container'
import Image from 'next/image'
import FancyLink from '../utils/fancyLink'

export default function Footer({seo, className = ''}) {
  return (
    <footer className={`w-full bg-[#3a343a] ${className}`}>
      <Container className="w-full h-full py-6 flex flex-col lg:flex-row justify-between items-start space-y-6 lg:space-y-0 lg:items-center">
        <div className="flex justify-center items-center">
          <FancyLink
            className="text-white font-medium text-xl block"
            destination="/"
          >
            Your Learning
          </FancyLink>
          <FancyLink
            className="ml-5 text-white font-medium text-xl block"
            destination="/about"
          >
            About
          </FancyLink>
        </div>
        <div className="relative w-16 h-16 aspect-square">
          <Image
            src={seo.Logo.data.attributes.url}
            alt={seo.Website_Title}
            layout="fill"
            objectFit="contain"
          />
        </div>
      </Container>
    </footer>
  )
}
