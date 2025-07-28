"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("lecturer");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const register = async () => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email,
        role,
      });

      alert("User registered successfully!");

      // Reset form
      setEmail("");
      setPassword("");
      setRole("lecturer");
      setIsLoading(false);

      // Redirect to login page
      router.push(`/auth/login`);
    } catch (err) {
      alert(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Register</h2>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <select
        className="border p-2 w-full mb-4"
        onChange={(e) => setRole(e.target.value)}
        value={role}
      >
        <option value="admin">Admin</option>
        <option value="lecturer">Lecturer</option>
      </select>

      <button
        className="bg-blue-600 text-white px-4 py-2 w-full mb-4"
        onClick={register}
        disabled={isLoading}
      >
        {isLoading ? "Registering..." : "Register"}
      </button>

      {/* 👇 Login link */}
      <p className="text-sm text-center">
        Already have an account?
        <button
          onClick={() => router.push("/auth/login")}
          className="text-blue-600 underline"
        >
          Login
        </button>
      </p>
    </div>
  );
}
