import React, { useState } from "react";
import emailjs from "emailjs-com"; // ✅ Import EmailJS

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.message) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess("");
    } else {
      setErrors({});

      // ✅ Send email via EmailJS
      emailjs
        .send(
          "service_tf1a3yj",   // 🔹 replace with your actual Service ID
          "template_asxe46a",  // 🔹 replace with your actual Template ID
          {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
          },
          "5mIHFMHU7KAxW6TJg"    // 🔹 replace with your actual Public Key
        )
        .then(
          () => {
            setSuccess("Message sent successfully!");
            setFormData({ name: "", email: "", subject: "", message: "" });
          },
          (error) => {
            console.error("EmailJS Error:", error);
            setSuccess("Failed to send message. Please try again.");
          }
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Contact Us</h1>

      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            />
            {errors.subject && (
              <p className="text-red-500 text-sm">{errors.subject}</p>
            )}
          </div>

          <div>
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg h-28 focus:ring-2 focus:ring-primary"
            />
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dull transition"
          >
            Send Message
          </button>

          {success && (
            <p className="text-green-600 text-center mt-2">{success}</p>
          )}
        </form>

        {/* Contact Info */}
        <div className="flex flex-col justify-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Get in Touch</h2>
          <p className="text-gray-600">📧 ayushlohiya722@gmail.com</p>
          <p className="text-gray-600">📞 +91 98765 43210</p>
          <p className="text-gray-600">📍 Mathura, Uttar Pradesh, India</p>

          <div className="flex space-x-4 mt-2">
            <a href="https://github.com/9140ayush" className="text-primary hover:text-primary-dull">
              Github
            </a>
            {/* <a href="#" className="text-primary hover:text-primary-dull">
              Instagram
            </a> */}
            <a href="https://www.linkedin.com/in/ayushlohiya/" className="text-primary hover:text-primary-dull">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
