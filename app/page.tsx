import Hero from '@/components/sections/Hero'
import AlignYourself from '@/components/sections/AlignYourself'
import Schools from '@/components/sections/Schools'
import MeetGurus from '@/components/sections/MeetGurus'
// import RecognitionTestimonials from '@/components/sections/RecognitionTestimonials'
// import TriangularNumbers from '@/components/sections/TriangularNumbers'
// import FoundersMission from '@/components/sections/FoundersMission'
import Contribute from '@/components/sections/Contribute'
import Community from '@/components/sections/Community'
import DownloadAppNew from '@/components/sections/DownloadAppNew'
import FAQ from '@/components/sections/FAQ'
import OAuthHandler from '@/components/OAuthHandler'

export default function Home() {
  return (
    <>
      <OAuthHandler />
      <Hero />
      <AlignYourself />
      <Schools />
      <MeetGurus />
      {/* <RecognitionTestimonials /> */}
      {/* <TriangularNumbers /> */}
      {/* <FoundersMission /> */}
      <Contribute />
      <Community />
      <DownloadAppNew />
      <FAQ />
    </>
  )
}
