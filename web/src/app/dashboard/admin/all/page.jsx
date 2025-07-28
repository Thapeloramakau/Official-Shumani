"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

export default function AdminSettings() {
  const [students, setStudents] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchLectures = async () => {
      const snapshot = await getDocs(collection(db, "lectures"));
      const lectureList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLectures(lectureList);
    };

    const fetchStudents = async () => {
      const snapshot = await getDocs(collection(db, "students"));
      const studentList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentList);
    };

    fetchLectures();
    fetchStudents();
  }, []);

  const handleSearch = async () => {
    if (!searchInput) return;

    const q = query(
      collection(db, "students"),
      where("studentNumber", "==", searchInput)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      setSelectedStudent({
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data(),
      });
    } else {
      alert("Student not found");
      setSelectedStudent(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Search Student</h2>
        <input
          type="text"
          placeholder="Enter student number"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>

        {selectedStudent && (
          <div className="mt-4 border p-4 rounded bg-gray-100">
            <h3 className="font-semibold text-lg">Student Details</h3>
            <p>
              <strong>Name:</strong> {selectedStudent.name}
            </p>
            <p>
              <strong>Student Number:</strong> {selectedStudent.studentNumber}
            </p>
            <p>
              <strong>Email:</strong> {selectedStudent.email}
            </p>
            <p>
              <strong>Modules:</strong>{" "}
              {selectedStudent.modules?.join(", ") || "N/A"}
            </p>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">All Students</h2>
        <ul className="list-disc ml-6">
          {students.map((student) => (
            <li key={student.id}>
              {student.name} ({student.studentNumber})
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold">All Lectures</h2>
        <ul className="list-disc ml-6">
          {lectures.map((lecture) => (
            <li key={lecture.id}>
              {lecture.name} ({lecture.email})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
