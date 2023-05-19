import { Carousel } from "react-responsive-carousel"
import { book, book1, book2, book4, book6 } from "../images/index"
import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader

function Banner() {
  return (
    <div className="relative top-15">
      <div className="absolute w-full h-32 bg-gradient-to-t from-gray-100 to-transparent bottom-0 z-20" />
      <Carousel
        autoPlay
        infiniteLoop
        showStatus={false}
        showIndicators={false}
        showThumbs={false}
        interval={5000}
      >
        <div>
          <img
            loading="lazy"
            src="https://links.papareact.com/gi1"
            alt="carousal"
          />
        </div>
        <div>
          <img
            loading="lazy"
            src="https://links.papareact.com/6ff"
            alt="carousal"
          />
        </div>
        <div>
          <img
            loading="lazy"
            src="https://links.papareact.com/7ma"
            alt="carousal"
          />
        </div>
      </Carousel>
    </div>
  )
}
export default Banner