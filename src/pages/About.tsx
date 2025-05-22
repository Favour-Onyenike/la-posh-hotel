
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="pt-24 md:pt-28 lg:pt-32 pb-16">
        {/* Hero Section with Background Image */}
        <section 
          className="py-20 md:py-32 lg:py-40 bg-cover bg-center relative"
          style={{ backgroundImage: "url('/lovable-uploads/e9be561a-1ed6-476f-aab8-fd04aaef0620.png')" }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="hotel-container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="hotel-title mb-6 text-white">About La Posh</h1>
              <p className="text-xl text-white">
                Where luxury meets elegance and sophistication
              </p>
            </div>
          </div>
        </section>

        {/* About Us Content */}
        <section className="section-padding">
          <div className="hotel-container">
            <div className="max-w-4xl mx-auto">
              <h2 className="hotel-subtitle mb-6 text-black">ABOUT US</h2>
              <div className="prose prose-lg max-w-none">
                <p className="mb-6 text-black">
                  Welcome to La Posh Signature Hotel & Suites, where luxury meets elegance and
                  sophistication. Located in the heart of the Abraka Town, our hotel offers an
                  unparalleled hospitality experience, blending modern amenities with timeless
                  charm.
                </p>
                <p className="mb-6 text-black">
                  Our story began with a passion for creating unforgettable experiences, and a
                  commitment to excellence in every detail. From our lavish rooms and suites, to
                  our world-class dining and entertainment options, every aspect of our hotel is
                  designed to exceed your expectations.
                </p>
                <p className="mb-6 text-black">
                  Whether you're a discerning business traveler, a romantic couple, or a family
                  on vacation, we invite you to experience the La Posh difference. Let us pamper
                  you with our signature blend of luxury, comfort, and genuine hospitality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission Section Side by Side */}
        <section className="section-padding bg-white">
          <div className="hotel-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Vision Card */}
              <Card className="shadow-md border-hotel-gold/20">
                <CardHeader>
                  <CardTitle className="hotel-subtitle text-black">OUR VISION</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-lg max-w-none">
                    <p className="mb-6 text-black">
                      At La Posh Signature Hotel & Suites, our vision is to become the premier luxury
                      destination in the hospitality industry, renowned for our exceptional service,
                      opulent amenities, and unparalleled guest experiences.
                    </p>
                    <p className="mb-6 text-black">
                      We strive to create a haven of elegance and sophistication, where every guest
                      feels valued, pampered, and inspired. Through our commitment to excellence,
                      innovation, and sustainability, we aim to exceed expectations, foster loyalty,
                      and make every stay with us an unforgettable memory.
                    </p>
                    <p className="mb-4 text-black">Our vision is built on the pillars of:</p>
                    <ul className="list-disc pl-6 mb-6 text-black">
                      <li>Uncompromising quality and attention to detail</li>
                      <li>Personalized service and genuine hospitality</li>
                      <li>Innovative amenities and cutting-edge technology</li>
                      <li>Sustainable practices and social responsibility</li>
                      <li>Continuous improvement and excellence</li>
                    </ul>
                    <p className="text-black">
                      By living our vision, we aim to make La Posh Signature Hotel & Suites the
                      ultimate choice for discerning travelers, and a benchmark for luxury
                      hospitality worldwide.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Mission Card */}
              <Card className="shadow-md border-hotel-gold/20">
                <CardHeader>
                  <CardTitle className="hotel-subtitle text-black">OUR MISSION</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-lg max-w-none">
                    <p className="mb-6 text-black">
                      At La Posh Signature Hotel & Suites, our mission is to provide exceptional
                      hospitality experiences that exceed our guests' expectations, while fostering a
                      culture of excellence, innovation, and sustainability.
                    </p>
                    <p className="mb-4 text-black">We are committed to:</p>
                    <ul className="list-disc pl-6 mb-6 text-black">
                      <li>
                        Delivering personalized, intuitive, and genuine service that makes every
                        guest feel valued and cared for.
                      </li>
                      <li>
                        Creating a luxurious, comfortable, and inspiring environment that enhances
                        our guests' well-being and productivity.
                      </li>
                      <li>
                        Offering innovative amenities, services, and experiences that surprise and
                        delight our guests.
                      </li>
                      <li>
                        Building strong relationships with our guests, partners, and community, based
                        on trust, respect, and mutual benefit.
                      </li>
                      <li>
                        Embracing sustainable practices and social responsibility, to minimize our
                        impact on the environment and contribute to the well-being of our community.
                      </li>
                    </ul>
                    <p className="text-black">
                      By living our mission, we aim to make La Posh Signature Hotel & Suites the
                      preferred choice for discerning travelers, and a leader in the hospitality
                      industry.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding">
          <div className="hotel-container">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="hotel-title text-black mb-6">Experience La Posh</h2>
              <p className="text-black mb-8 text-lg">
                We invite you to experience the luxury and elegance of La Posh Signature Hotel & Suites.
                Book your stay today and discover why we're the preferred choice for discerning travelers.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="/rooms" className="bg-hotel-gold text-white hover:bg-transparent hover:text-hotel-gold border-2 border-hotel-gold transition-all duration-300 px-8 py-3 rounded-md text-sm font-medium">
                  Explore Our Rooms
                </a>
                <a href="/contact" className="bg-hotel-gold text-white hover:bg-transparent hover:text-hotel-gold border-2 border-hotel-gold transition-all duration-300 px-8 py-3 rounded-md text-sm font-medium">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default About;
