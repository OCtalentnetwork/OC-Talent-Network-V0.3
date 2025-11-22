import React from 'react';
import NeoButton from '../components/NeoButton';

const Consultation: React.FC = () => {
  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center py-20">
      <div className="max-w-3xl w-full">
        <h1 className="text-5xl font-black uppercase mb-8 border-b-8 border-octn-blue inline-block">
          Book Consultation
        </h1>
        <p className="text-xl mb-12 font-medium text-gray-700">
          Ready to transform your hiring pipeline? Speak with our human experts at Open Concept Talent Network.
        </p>

        <form className="border-4 border-black p-8 shadow-neo-lg bg-gray-50 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold uppercase mb-2">First Name</label>
              <input type="text" className="w-full border-2 border-black p-3 focus:outline-none focus:ring-4 focus:ring-octn-blue transition-all" />
            </div>
            <div>
              <label className="block font-bold uppercase mb-2">Last Name</label>
              <input type="text" className="w-full border-2 border-black p-3 focus:outline-none focus:ring-4 focus:ring-octn-blue transition-all" />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase mb-2">Email Address</label>
            <input type="email" className="w-full border-2 border-black p-3 focus:outline-none focus:ring-4 focus:ring-octn-blue transition-all" />
          </div>

          <div>
            <label className="block font-bold uppercase mb-2">Company Type</label>
            <select className="w-full border-2 border-black p-3 bg-white focus:outline-none focus:ring-4 focus:ring-octn-blue transition-all">
              <option>Architecture Firm</option>
              <option>Engineering Firm</option>
              <option>Construction Company</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block font-bold uppercase mb-2">Message</label>
            <textarea rows={4} className="w-full border-2 border-black p-3 focus:outline-none focus:ring-4 focus:ring-octn-blue transition-all"></textarea>
          </div>

          <NeoButton fullWidth type="button" onClick={() => alert("Booking request simulation sent!")}>
            Submit Request
          </NeoButton>
        </form>
      </div>
    </div>
  );
};

export default Consultation;