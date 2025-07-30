import React, { useEffect, useState } from "react";
import "./students.css";
import { supabase } from "../supabaseClient";

const Students = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from("students")
        .select(
          "full_names, student_no, email, course, status, enrollment_date, contact_no"
        );

      if (error) {
        console.error("Error fetching students:", error);
      } else {
        setStudents(data);
      }
    };

    fetchStudents();
  }, []);
  function groupByCourse(students) {
    return students.reduce((acc, student) => {
      const course = student.course || "Unassigned";
      if (!acc[course]) {
        acc[course] = [];
      }
      acc[course].push(student);
      return acc;
    }, {});
  }

  return (
    <div className="students-page-container">
      {/* Header Section */}
      <div className="students-header">
        <div className="company-card">
          <h2>Lekota Training Pty Ltd</h2>
          <p>📍 123 Campus Lane, Johannesburg</p>
          <p>📞 010 123 4567</p>
          <p className="note">Registered students are shown below</p>
        </div>

        <div className="count-card">
          <h1>{students.length}</h1>
          <p>Students</p>
        </div>
      </div>

      {/* Table Section */}
      <header className="students-intro">
        <h1>Students</h1>
        <p>View all your enrolled and completed students below.</p>
      </header>

      <div className="student-list-card">
        <h3>Students Overview</h3>
        {Object.entries(groupByCourse(students)).map(
          ([courseName, studentsInCourse]) => (
            <div key={courseName} style={{ marginBottom: "2rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <strong>Enrollment Date:</strong>{" "}
                  {studentsInCourse[0]?.enrollment_date
                    ? new Date(
                        studentsInCourse[0].enrollment_date
                      ).toLocaleDateString()
                    : "N/A"}
                </div>
                <div>
                  <strong>Course:</strong> {courseName}
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Student No.</th>
                    <th>Full Name</th>
                    <th>Email</th>

                    <th>Contact No.</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsInCourse.map((stu) => (
                    <tr key={stu.id}>
                      <td>{stu.student_no}</td>
                      <td>{stu.full_names}</td>

                      <td>{stu.email}</td>

                      <td>{stu.contact_no}</td>
                      <td>{stu.status ? "Active" : "Inactive"}</td>
                      <td>
                        {/* You can place buttons here if needed */}
                        <button>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
};

/* 
        <div className="table-header">
          <span>Name</span>
          <span>Student #</span>
          <span>Email</span>
          <span>Course</span>
          <span>Status</span>
        </div>

        {students.map((student, index) => (
          <div key={index} className="student-row">
            <span>{student.full_names}</span>
            <span>{student.student_no}</span>
            <span>{student.email}</span>
            <span>{student.course}</span>
            <span
              className={`status ${student.status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {student.status}
            </span>
          </div>
        ))}
      </div> */
//     </div>
//   );
// };

export default Students;
