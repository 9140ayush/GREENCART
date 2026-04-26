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
          "service_tf1a3yj",
          "template_asxe46a",
          {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
          },
          "5mIHFMHU7KAxW6TJg"
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
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-20 px-6 animate-in fade-in duration-700">
      {/* Heading Section */}
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-heading uppercase tracking-tighter">
          Get In <span className="text-accent">Touch</span>
        </h1>
        <p className="text-muted font-bold uppercase tracking-[0.2em] text-[10px]">We're here to help you grow fresh</p>
      </div>

      {/* Main Contact Container */}
      <div className="bg-card border border-border-main shadow-2xl rounded-[40px] overflow-hidden w-full max-w-5xl grid md:grid-cols-2 group hover:shadow-accent/5 transition-all duration-500">
        
        {/* Left Side: Contact Form */}
        <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-border-soft bg-surface/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted dark:text-gray-300 uppercase tracking-widest px-1">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-surface dark:bg-page border border-border-soft rounded-2xl py-4 px-6 focus:ring-4 focus:ring-accent/10 focus:border-accent/40 outline-none transition-all font-bold text-heading dark:text-white placeholder:text-muted/40 dark:placeholder-gray-400"
              />
              {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide px-2 mt-1">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted dark:text-gray-300 uppercase tracking-widest px-1">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-surface dark:bg-page border border-border-soft rounded-2xl py-4 px-6 focus:ring-4 focus:ring-accent/10 focus:border-accent/40 outline-none transition-all font-bold text-heading dark:text-white placeholder:text-muted/40 dark:placeholder-gray-400"
              />
              {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide px-2 mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted dark:text-gray-300 uppercase tracking-widest px-1">Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="How can we help?"
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-surface dark:bg-page border border-border-soft rounded-2xl py-4 px-6 focus:ring-4 focus:ring-accent/10 focus:border-accent/40 outline-none transition-all font-bold text-heading dark:text-white placeholder:text-muted/40 dark:placeholder-gray-400"
              />
              {errors.subject && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide px-2 mt-1">{errors.subject}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted dark:text-gray-300 uppercase tracking-widest px-1">Your Message</label>
              <textarea
                name="message"
                placeholder="Type your message here..."
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-surface dark:bg-page border border-border-soft rounded-2xl py-4 px-6 h-36 focus:ring-4 focus:ring-accent/10 focus:border-accent/40 outline-none transition-all font-bold text-heading dark:text-white placeholder:text-muted/40 dark:placeholder-gray-400 resize-none leading-relaxed"
              />
              {errors.message && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide px-2 mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-accent text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-accent/20 hover:bg-primary-dull hover:-translate-y-1 active:scale-95 transition-all text-sm mt-4"
            >
              Send Message
            </button>

            {success && (
              <p className="text-accent font-bold text-center mt-4 bg-accent/10 py-3 rounded-xl border border-accent/20 animate-in slide-in-from-top-2">{success}</p>
            )}
          </form>
        </div>

        {/* Right Side: Contact Info */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-surface/10 space-y-10 relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <h2 className="text-3xl font-black text-heading uppercase tracking-tighter">Contact <span className="text-accent">Info</span></h2>
            <p className="text-muted font-medium leading-relaxed">Have a question or feedback? We'd love to hear from you. Reach out through any of these channels.</p>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-5 group/item">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover/item:bg-accent group-hover/item:text-white transition-all duration-300">
                <span className="text-xl">📧</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-muted uppercase tracking-widest">Email Us</p>
                <p className="text-heading font-bold text-lg">ayushlohiya722@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-5 group/item">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover/item:bg-accent group-hover/item:text-white transition-all duration-300">
                <span className="text-xl">📞</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-muted uppercase tracking-widest">Call Us</p>
                <p className="text-heading font-bold text-lg">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-center gap-5 group/item">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover/item:bg-accent group-hover/item:text-white transition-all duration-300">
                <span className="text-xl">📍</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-muted uppercase tracking-widest">Visit Us</p>
                <p className="text-heading font-bold text-lg">Mathura, Uttar Pradesh, India</p>
              </div>
            </div>
          </div>

          <div className="pt-8 space-y-4 relative z-10">
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Connect with our founder</p>
            <div className="flex gap-4">
              <a href="https://github.com/9140ayush" className="px-6 py-3 bg-card border border-border-soft rounded-xl text-heading font-black text-xs uppercase tracking-widest hover:border-accent hover:text-accent transition-all shadow-sm">
                Github
              </a>
              <a href="https://www.linkedin.com/in/ayushlohiya/" className="px-6 py-3 bg-card border border-border-soft rounded-xl text-heading font-black text-xs uppercase tracking-widest hover:border-accent hover:text-accent transition-all shadow-sm">
                LinkedIn
              </a>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
