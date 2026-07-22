import { HeroSection } from "../../components/Home/Herosection";
import Categories from "../../components/Home/Categories";
import DiscoverTrending from "../../components/Home/DiscoverTrending";
import NewLaunches from "../../components/Home/NewLaunches";
import PromoBanners from "../../components/Home/PromoBanners";
import Offers from "../../components/Home/Offer";
import BusinessProducts from "../../components/Home/BusinessProducts";

export default function Page() {
  return (
    <>
      <HeroSection />
      <Categories />
      <BusinessProducts/>
      <DiscoverTrending />
      <NewLaunches />
      <PromoBanners />
      <Offers />
    </>
  );
}