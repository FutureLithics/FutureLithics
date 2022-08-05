import React, { useState } from "react";

import ContactForm from "../../shared/ContactForm";
import ModalContainer from "../../modals/ModalContainer";

const links = [
  {
    path: "https://www.upwork.com/freelancers/chaddenaux",
    title: "Upwork",
  },
  {
    path: "https://github.com/FutureLithics",
    title: "Github",
  },
  {
    path: "https://lyricitriade.com/",
    title: "Blog",
  },
  {
    path: "https://www.linkedin.com/in/chad-denaux/",
    title: "LinkedIn",
  },
];

const Links = () => {
  return links.map((l, i) => {
    return (
      <li key={`links-${i}`}>
        <a
          href={l.path}
          className="text-secondary text-underline"
          target="_blank"
          rel="noreferrer"
        >
          {l.title}
        </a>
      </li>
    );
  });
};

const ContactSection = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [response, setResponse] = useState({});

  return (
    <div className="contact-section py-4">
      <a name="contact-section"></a>
      <div className="container py-4">
        <div className="row px-3 flex-sm-inline flex-xs-column justify-content-around align-content-around text-secondary">
          <div className="section col-md-5 py-4 px-3 mt-4">
            <h3 className="mb-4">Schedule a Consultation</h3>
            <p className="mb-2">
              Future Lithics LLC<br />
              Chad R. Denaux <br />
              Seneca, SC
            </p>
            <h5 className="mt-4">Information</h5>
            <ul>
              <Links />
            </ul>
            <p className="small-text large-top-margin">
              * I believe in supporting local economy. I am willing to provide
              some services at a slight discount if you are a local, independent
              business in upstate South Carolina. Please contact me for a direct
              contract.
            </p>
          </div>
          <div className="section col-md-5 py-4 px-3 mt-4">
            <ContactForm
              setResponse={setResponse}
              setModalOpen={setModalOpen}
            />
          </div>
        </div>
      </div>
      <ModalContainer
        type="alert"
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        response={response}
      />
    </div>
  );
};

export default ContactSection;
