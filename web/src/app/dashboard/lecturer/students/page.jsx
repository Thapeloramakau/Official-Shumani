"use client";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredStudent, setFilteredStudent] = useState(null);

  const fetchAllStudents = async () => {
    const q = query(collection(db, "students"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setStudents(data);
  };

  const handleSearch = async () => {
    if (!search) return;
    const q = query(
      collection(db, "students"),
      where("studentNumber", "==", search)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const student = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
      // Fetch modules if moduleIds exist
      if (student.moduleIds && student.moduleIds.length > 0) {
        const modules = await Promise.all(
          student.moduleIds.map(async (moduleId) => {
            const modDoc = await getDoc(doc(db, "modules", moduleId));
            return modDoc.exists() ? { id: modDoc.id, ...modDoc.data() } : null;
          })
        );
        student.modules = modules.filter(Boolean);
      }
      setFilteredStudent(student);
    } else {
      setFilteredStudent(null);
    }
  };

  useEffect(() => {
    fetchAllStudents();
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ fontSize: "24px", marginBottom: "20px", color: "#2c3e50" }}>
        🎓 Students
      </h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by student number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginRight: "10px",
            width: "250px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 16px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {filteredStudent ? (
        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "30px",
          }}
        >
          <h3>{filteredStudent.fullName}</h3>
          <p>Student Number: {filteredStudent.studentNumber}</p>
          <p>Email: {filteredStudent.email}</p>
          <h4>📘 Modules</h4>
          <ul>
            {filteredStudent.modules?.length > 0 ? (
              filteredStudent.modules.map((mod, index) => (
                <li key={index}>{mod}</li>
              ))
            ) : (
              <li>No modules assigned</li>
            )}
          </ul>
        </div>
      ) : search ? (
        <p>No student found for that number.</p>
      ) : null}

      <h3>📋 All Students</h3>
      <ul style={{ padding: 0, listStyle: "none" }}>
        {students.map((student) => (
          <li
            key={student.id}
            style={{
              padding: "10px 0",
              borderBottom: "1px solid #ddd",
            }}
          >
            <strong>{student.fullName}</strong> ({student.studentNumber})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentsPage;
