import Header from "../components/Header";
import Steps from "../components/Steps";
import Testimonials from "../components/Testimonials";
import GenerateBtn from "../components/GenerateBtn";
import ProductShowcase from "../components/ProductShowcase";

const Home = () => {
  return (
    <div>
      <Header />
      <Steps />
      <ProductShowcase />
      {/* <Description /> */}
      <Testimonials />
      <GenerateBtn />
    </div>
  );
};

export default Home;
