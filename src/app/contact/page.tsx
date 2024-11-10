import { ContactForm } from "@/components/Contact/ContactForm";

export default function Contact() {
  return (
    <section className="flex flex-col justify-center items-center h-full py-12">
      <div className="flex flex-col justify-center items-center w-full gap-12 md:flex-row">
        <div className="flex flex-col max-w-md gap-4 mb-4 md:self-start">
          <h1 className="text-3xl">Contact Us</h1>
          <h2 className="font-bold">We're Here to Help!</h2>
          <p>
            Thank you for reaching out to us. Whether you're a healthcare
            professional looking for resources, or a patient seeking more
            information about healthcare providers, we're here to support you.
            Please feel free to share your questions, feedback, or inquiries,
            and our team will get back to you as soon as possible.
          </p>
          <p>
            Your well-being and access to quality healthcare are our top
            priority. We look forward to connecting with you!
          </p>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
