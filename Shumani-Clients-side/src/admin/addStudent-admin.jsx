import React, { useState, useEffect } from "react";
import "./admin.css";
import { supabase } from "../supabaseClient";

const AddStudents = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    course: "",
    contactNumber: "",
    status: true,
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data, error } = await supabase.from("students").select("*");
    if (error) {
      console.error("Fetch error:", error.message);
    } else {
      setStudents(data);
    }
  };
 const generateStudentNumber = async () => {
   const today = new Date();
   const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");

   
   const { data, error } = await supabase
     .from("students")
     .select("student_no")
     .like("student_no", `STU-${dateStr}-%`);

   let count = (data?.length || 0) + 1;
   let paddedCount = count.toString().padStart(3, "0");

   return `STU-${dateStr}-${paddedCount}`;
 };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
const student_no = await generateStudentNumber();
    const { fullName, email, company, course, contactNumber, status } =
      formData;
    if (
      !fullName ||
      !email ||
      !company ||
      !course ||
      !contactNumber ||
      !status
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const { data, error } = await supabase.from("students").insert([
      {
        full_names: fullName,
        email: email,
        company_name: company,
        course: course,
        contact_no: contactNumber,
        status: status,
      },
    ]);

    if (error) {
      console.error("Supabase INSERT error:", error);
      alert("Failed to add student: " + error.message);
    } else {
      console.log("Student added:", data);
      alert("Student added successfully!");
      setFormData({
        fullName: "",
        email: "",
        company: "",
        course: "",
        contactNumber: "",
        status: "Active",
      });
      fetchStudents();
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) {
      console.error("Delete error:", error.message);
    } else {
      fetchStudents();
    }
  };

  return (
    <div className="container">
      <h1>Add Students</h1>

      <form onSubmit={handleAddStudent}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={formData.company}
          onChange={handleChange}
        />
        <input
          type="text"
          name="course"
          placeholder="Course Name"
          value={formData.course}
          onChange={handleChange}
        />
        <input
          type="text"
          name="contactNumber"
          placeholder="Contact Number"
          value={formData.contactNumber}
          onChange={handleChange}
        />
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value={true}>Active</option>
          <option value={false}>Inactive</option>
        </select>

        <button type="submit">Add Student</button>
      </form>

      {students.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Student No.</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Course</th>
              <th>Contact No.</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((stu) => (
              <tr key={stu.id}>
                <td>{stu.student_no}</td>

                <td>{stu.full_names}</td>
                <td>{stu.email}</td>
                <td>{stu.company_name}</td>
                <td>{stu.course}</td>
                <td>{stu.contact_no}</td>

                <td>{stu.status ? "Active" : "Inactive"}</td>

                <td>
                  <button onClick={() => handleDelete(stu.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No students added yet.</p>
      )}
    </div>
  );
};

export default AddStudents;
