import { createContext, useEffect, useState } from "react";
import { getMe } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudent = async () => {
      const token = localStorage.getItem("studentToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getMe();
        setStudent(res.data.student);
      } catch (error) {
        console.error("Failed to load student session:", error);
        localStorage.removeItem("studentToken");
        localStorage.removeItem("student");
        setStudent(null);
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, []);

  const login = (token, studentData) => {
    localStorage.setItem("studentToken", token);
    localStorage.setItem("student", JSON.stringify(studentData));
    setStudent(studentData);
  };

  const logout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("student");
    setStudent(null);
  };

  return (
    <AuthContext.Provider value={{ student, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
