import useCarousel from '@/hooks/fancybox/use-carousel';
import ServiceListSection from './_components/services-list-section';
import WelcomeSection from './_components/welcome-section';

const HomePage = () => {
  const [carouselRef] = useCarousel();

  return (
    <>
      <div ref={carouselRef} className="f-carousel" id="myCarousel">
        <div className="f-carousel__slide">1</div>
        <div className="f-carousel__slide">2</div>
        <div className="f-carousel__slide">3</div>
        <div className="f-carousel__slide">4</div>
        <div className="f-carousel__slide">5</div>
      </div>

      <WelcomeSection />

      <ServiceListSection withHeader={true} />
    </>
  );
};

export default HomePage;
