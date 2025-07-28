"use client";
import { useEffect, useState } from "react";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const ModulesPage = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lecturerId, setLecturerId] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLecturerId(user.uid);
      } else {
        console.log("User not signed in.");
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!lecturerId) return;

    const q = query(
      collection(db, "modules"),
      where("lecturerId", "==", lecturerId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setModules(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [lecturerId]);

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: 40 }}>Loading modules...</p>
    );

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ fontSize: "24px", marginBottom: "20px", color: "#2c3e50" }}>
        📚 Your Assigned Modules
      </h2>

      {modules.length === 0 ? (
        <p>No modules assigned to you.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {modules.map((module) => (
            <li
              key={module.id}
              style={{
                padding: "16px",
                marginBottom: "12px",
                backgroundColor: "#ecf0f1",
                borderRadius: "10px",
              }}
            >
              <strong>{module.moduleName}</strong> <br />
              <span style={{ color: "#555" }}>Code: {module.moduleCode}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ModulesPage;
