"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const availableModules = [
  "Development Software 3A",
  "Information Systems 3A",
  "Communications Network 3A",
  "Development Software 3B",
  "Information Systems 3B",
  "Communications Network 3B",
];

export default function ManageUsers() {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    idNumber: "",
    course: "",
    modules: [],
  });

  const [loading, setLoading] = useState(false);

  const generateStudentNumber = () => {
    return Math.floor(100000000 + Math.random() * 900000000).toString();
  };

  const handleCheckboxChange = (module) => {
    setForm((prev) => {
      const modules = prev.modules.includes(module)
        ? prev.modules.filter((m) => m !== module)
        : [...prev.modules, module];
      return { ...prev, modules };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const studentNumber = generateStudentNumber();

    try {
      await addDoc(collection(db, "students"), {
        ...form,
        studentNumber,
        createdAt: new Date(),
      });

      alert(`Student created successfully. Student Number: ${studentNumber}`);

      // Reset form
      setForm({
        name: "",
        surname: "",
        idNumber: "",
        course: "",
        modules: [],
      });
    } catch (error) {
      console.error("Error creating student:", error);
      alert("Failed to create student.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create Student</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full border rounded px-4 py-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Surname"
          className="w-full border rounded px-4 py-2"
          value={form.surname}
          onChange={(e) => setForm({ ...form, surname: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="ID Number"
          className="w-full border rounded px-4 py-2"
          value={form.idNumber}
          onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Course"
          className="w-full border rounded px-4 py-2"
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
          required
        />

        <div>
          <p className="font-semibold mb-2">Assign Modules:</p>
          <div className="grid grid-cols-2 gap-2">
            {availableModules.map((module) => (
              <label key={module} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.modules.includes(module)}
                  onChange={() => handleCheckboxChange(module)}
                />
                {module}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Create Student"}
        </button>
      </form>
    </div>
  );
}
