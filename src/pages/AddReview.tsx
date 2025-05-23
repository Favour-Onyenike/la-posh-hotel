
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewForm from "@/components/ReviewForm";

const AddReview = () => {
  return (
    <>
      <Navbar />
      <div className="bg-hotel-beige min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-serif text-center mb-8">Share Your Experience</h1>
          <p className="text-center mb-12 max-w-2xl mx-auto">
            We value your feedback! Please share your experience at La-posh Signature Suites to help us improve and to help other guests make informed decisions.
          </p>
          <ReviewForm />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddReview;
