"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function MarriageBookingDemo() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    bride: "",
    groom: "",
    date: "",
    venue: "",
    package: "Standard",
  });

  const update = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">💍 Online Marriage Booking</h1>

        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-10 h-2 rounded-full ${
                step >= s ? "bg-pink-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-semibold mb-4">Couple Details</h2>
            <input
              name="bride"
              placeholder="Bride's Name"
              className="w-full p-3 border rounded-xl mb-3"
              onChange={update}
            />
            <input
              name="groom"
              placeholder="Groom's Name"
              className="w-full p-3 border rounded-xl"
              onChange={update}
            />
            <button
              onClick={() => setStep(2)}
              className="mt-4 w-full bg-pink-500 text-white py-3 rounded-xl"
            >
              Next
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-semibold mb-4">Wedding Details</h2>
            <input
              type="date"
              name="date"
              className="w-full p-3 border rounded-xl mb-3"
              onChange={update}
            />
            <input
              name="venue"
              placeholder="Venue"
              className="w-full p-3 border rounded-xl mb-3"
              onChange={update}
            />
            <select
              name="package"
              className="w-full p-3 border rounded-xl"
              onChange={update}
            >
              <option>Standard</option>
              <option>Premium</option>
              <option>Royal</option>
            </select>
            <button
              onClick={() => setStep(3)}
              className="mt-4 w-full bg-pink-500 text-white py-3 rounded-xl"
            >
              Review Booking
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-semibold mb-4">Confirmation</h2>
            <div className="bg-gray-50 p-4 rounded-xl text-sm">
              <p><strong>Bride:</strong> {form.bride}</p>
              <p><strong>Groom:</strong> {form.groom}</p>
              <p><strong>Date:</strong> {form.date}</p>
              <p><strong>Venue:</strong> {form.venue}</p>
              <p><strong>Package:</strong> {form.package}</p>
            </div>
            <button
              onClick={() => alert("Booking Submitted! (Demo)")}
              className="mt-4 w-full bg-green-500 text-white py-3 rounded-xl"
            >
              Confirm Booking
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
