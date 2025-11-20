import { Footer } from "../components/common/Footer"
import { FeaturedHotels } from "../components/home/FeaturedHotels"
import { Hero } from "../components/home/Hero"
import { Newsletter } from "../components/home/Newsletter"
import { Testimonials } from "../components/home/Testimonials"
import NavBar from "../components/common/NavBar"

export const Home = () => {
  return (
    <>
      <NavBar />
      <Hero />
      <FeaturedHotels />
      {/* <WhyChooseUs /> */}
      <Testimonials />
      <Newsletter />
      <Footer />
    </>
  )
}
