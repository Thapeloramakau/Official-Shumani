"use client";

import React, { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const MODULE_OPTIONS = [
  "Development Software 3A",
  "Information Systems 3A",
  "Communications Network 3A",
  "Development Software 3B",
  "Information Systems 3B",
  "Communications Network 3B",
];

export default function UploadContent() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    module: "",
    file: null,
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, file: e.target.files[0] || null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    if (!form.title || !form.category || !form.module) {
      alert("Please complete the title, category, and module fields.");
      setUploading(false);
      return;
    }

    try {
      if (form.file) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result;

          await addDoc(collection(db, "upload"), {
            title: form.title,
            category: form.category,
            module: form.module,
            file: base64String,
            createdAt: Timestamp.now(),
          });

          alert("Content uploaded successfully!");
          setForm({ title: "", category: "", module: "", file: null });
          setUploading(false);
        };

        reader.readAsDataURL(form.file);
      } else {
        await addDoc(collection(db, "upload"), {
          title: form.title,
          category: form.category,
          module: form.module,
          file: null,
          createdAt: Timestamp.now(),
        });

        alert("content uploaded successfully!");
        setForm({ title: "", category: "", module: "", file: null });
        setUploading(false);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload content.");
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-6">Upload Module Content</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <select
          name="module"
          value={form.module}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="" disabled>
            Select Module
          </option>
          {MODULE_OPTIONS.map((mod) => (
            <option key={mod} value={mod}>
              {mod}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload content"}
        </button>
      </form>
    </div>
  );
}
