import { useDocumentMeta } from '../hooks/useDocumentMeta'
import Hero from '../sections/Hero'
import SelectedWork from '../sections/SelectedWork'
import Impact from '../sections/Impact'
import About from '../sections/About'
import Capabilities from '../sections/Capabilities'
import Testimonials from '../sections/Testimonials'
import Contact from '../sections/Contact'

export default function HomePage() {
  useDocumentMeta({})

  return (
    <>
      <Hero />
      <SelectedWork />
      <Impact />
      <About />
      <Capabilities />
      <Testimonials />
      <Contact />
    </>
  )
}
