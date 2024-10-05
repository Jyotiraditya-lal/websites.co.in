import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ReCAPTCHA from "react-google-recaptcha";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ITEM_TYPE = "formElement";

const DraggableElement = ({ children, id, index, moveElement }) => {
  const [, ref] = useDrag({
    type: ITEM_TYPE,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover(item) {
      if (item.index !== index) {
        moveElement(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className="cursor-move mb-4">
      {children}
    </div>
  );
};

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [elements, setElements] = useState([
    { id: 1, content: "map" },
    { id: 2, content: "name" },
    { id: 3, content: "emailPhone" },
    { id: 4, content: "subject" },
    { id: 5, content: "message" },
    { id: 6, content: "captcha" },
    { id: 7, content: "submitButton" },
  ]);

  const moveElement = (from, to) => {
    const updatedElements = [...elements];
    const [movedItem] = updatedElements.splice(from, 1);
    updatedElements.splice(to, 0, movedItem);
    setElements(updatedElements);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleCaptcha = (value) => {
    console.log("Captcha value:", value);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col p-10">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {elements.map((element, index) => (
            <DraggableElement
              key={element.id}
              id={element.id}
              index={index}
              moveElement={moveElement}
            >
              {element.content === "map" && (
                <div className="md:w-1/2 mb-8 md:mb-0">
                  <MapContainer
                    center={[19.1075, 72.8365]}
                    zoom={13}
                    className="h-72 w-full"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[19.1075, 72.8365]}>
                      <Popup>
                        Websites.co.in <br /> Atal Incubation Centre, Second
                        Floor, NMIMS University V.L., Pherozeshah Mehta RD, Vile
                        Parle West, Mumbai, Maharashtra 400056
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              )}

              {element.content === "name" && (
                <div>
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                    required
                  />
                </div>
              )}

              {element.content === "emailPhone" && (
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label className="block text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="w-full p-2 border border-gray-300 rounded mt-1"
                      required
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-gray-700">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                  </div>
                </div>
              )}

              {element.content === "subject" && (
                <div>
                  <label className="block text-gray-700">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                  />
                </div>
              )}

              {element.content === "message" && (
                <div>
                  <label className="block text-gray-700">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message for us"
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                    required
                  ></textarea>
                </div>
              )}

              {element.content === "captcha" && (
                <div className="mt-4">
                  <ReCAPTCHA
                    sitekey="YOUR_RECAPTCHA_SITE_KEY"
                    onChange={handleCaptcha}
                  />
                </div>
              )}

              {element.content === "submitButton" && (
                <button
                  type="submit"
                  className="mt-4 bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition w-full"
                >
                  Send Message
                </button>
              )}
            </DraggableElement>
          ))}
        </form>
      </div>
    </DndProvider>
  );
};

export default ContactForm;
