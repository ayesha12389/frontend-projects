import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import './index.css';


function LearnMore() {
  return (
    <>
      <Navbar />
      <header className="bg-blue-700 text-white text-center py-6">
        <h1 className="text-4xl font-bold">Learn More About Skin Cancer</h1>
      </header>

      <section className="px-6 py-12">
        {/* What is Skin Cancer */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            What is Skin Cancer?
          </h2>
          <p className="text-gray-700 mb-4">
            Skin cancer is the most common type of cancer in the United States.
            It develops when skin cells begin to grow uncontrollably, often due
            to UV radiation from the sun or tanning beds.
          </p>
          <p className="text-gray-700">
            There are several types of skin cancer, including basal cell
            carcinoma (BCC), squamous cell carcinoma (SCC), and melanoma, the
            most dangerous form. It is essential to understand the risk factors
            and prevention strategies to protect yourself and others from this
            disease.
          </p>
        </div>

        {/* Symptoms */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            Common Symptoms of Skin Cancer
          </h2>
          <p className="text-gray-700 mb-4">
            Skin cancer symptoms vary depending on the type, but here are some
            common signs to watch out for:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>
              <strong>Asymmetry:</strong> One half of the mole does not match
              the other half.
            </li>
            <li>
              <strong>Border Irregularity:</strong> The edges of the mole are
              uneven or notched.
            </li>
            <li>
              <strong>Color Variance:</strong> The mole has multiple colors or
              uneven shading.
            </li>
            <li>
              <strong>Diameter:</strong> Skin lesions larger than 6mm (the size
              of a pencil eraser).
            </li>
            <li>
              <strong>Evolving:</strong> A mole that changes over time in size,
              shape, or color.
            </li>
          </ul>
          <img
            src="images/sym.webp"
            alt="Skin Cancer Symptoms"
            className="rounded-lg w-1/3"
          />
        </div>

        {/* Prevention */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            Prevention Tips
          </h2>
          <p className="text-gray-700 mb-4">
            Here are some tips to help reduce the risk of developing skin
            cancer:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Wear sunscreen with a broad-spectrum SPF of at least 30.</li>
            <li>
              Avoid tanning beds and excessive sun exposure, especially between
              10 AM and 4 PM.
            </li>
            <li>Wear protective clothing, such as hats and long sleeves.</li>
            <li>
              Perform regular skin self-exams to monitor changes in your skin.
            </li>
          </ul>
          <img
            src="images/pre.webp"
            alt="Skin Cancer Prevention"
            className="rounded-lg w-1/3"
          />
        </div>

        {/* Treatment */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            Treatment Options
          </h2>
          <p className="text-gray-700 mb-4">
            Treatment for skin cancer varies depending on the type and stage.
            Common treatment methods include:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>
              <strong>Excision:</strong> The cancerous tissue is surgically
              removed.
            </li>
            <li>
              <strong>Mohs Surgery:</strong> A precise surgical technique that
              removes cancerous tissue layer by layer.
            </li>
            <li>
              <strong>Radiation Therapy:</strong> High-energy rays are used to
              target cancer cells.
            </li>
            <li>
              <strong>Chemotherapy:</strong> Drugs are used to destroy cancer
              cells.
            </li>
            <li>
              <strong>Immunotherapy:</strong> Boosting the immune system to
              fight cancer cells.
            </li>
          </ul>
          <img
            src="images/treat.webp"
            alt="Skin Cancer Treatment"
            className="rounded-lg w-1/3"
          />
        </div>

        {/* ISIC Dataset */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            Using the ISIC 2024 Dataset for Skin Cancer Detection
          </h2>
          <p className="text-gray-700 mb-4">
            The ISIC (International Skin Imaging Collaboration) dataset is a
            major resource used for improving the accuracy of skin cancer
            detection. The ISIC 2024 dataset includes thousands of high-quality
            images of skin lesions, which are annotated with diagnostic labels.
            These images help train machine learning models that can detect skin
            cancer, particularly melanoma, with high precision.
          </p>
          <p className="text-gray-700">
            By leveraging the ISIC dataset, researchers are continuously
            advancing the use of artificial intelligence in dermatology,
            allowing for earlier and more accurate skin cancer diagnosis. This
            aids healthcare providers and individuals in better identifying
            potential skin cancer lesions, making early detection easier and
            more reliable.
          </p>
          <img
            src="images/isic.webp"
            alt="ISIC Dataset and AI Detection"
            className="rounded-lg w-1/3"
          />
        </div>
      </section>

      <Footer />
    </>
  );
}

export default LearnMore;
