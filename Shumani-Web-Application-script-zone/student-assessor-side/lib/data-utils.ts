import type { AppData, Student, Module, SubModule } from "./types"

const LOCAL_STORAGE_KEY = "v0_education_app_data"

/**
 * Loads application data from localStorage. If no data is found, initializes default data.
 * @returns {AppData} The loaded or initialized application data.
 */
export function loadData(): AppData {
  if (typeof window === "undefined") {
    // This case handles server-side rendering environments where localStorage is not available.
    // For Next.js, which runs in the browser, this block might not be strictly necessary
    // but is good practice for universal applications.
    return initializeData()
  }
  const data = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (data) {
    return JSON.parse(data)
  }
  return initializeData()
}

/**
 * Saves application data to localStorage.
 * @param {AppData} data The data to save.
 */
export function saveData(data: AppData) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
  }
}

/**
 * Initializes default application data with sample students, modules, and sub-modules.
 * @returns {AppData} The initialized default application data.
 */
export function initializeData(): AppData {
  const student1: Student = {
    id: "s1",
    name: "Alice Smith",
  }

  const student2: Student = {
    id: "s2",
    name: "Bob Johnson",
  }

  const subModule1_1: SubModule = {
    id: "sm1_1",
    moduleId: "m1",
    name: "Introduction to Programming",
    description: "Basic concepts of programming and syntax.",
  }

  const subModule1_2: SubModule = {
    id: "sm1_2",
    moduleId: "m1",
    name: "Data Structures & Algorithms",
    description: "Understanding common data structures and algorithmic complexity.",
  }

  const subModule2_1: SubModule = {
    id: "sm2_1",
    moduleId: "m2",
    name: "Calculus I",
    description: "Fundamentals of differential and integral calculus.",
  }

  const subModule2_2: SubModule = {
    id: "sm2_2",
    moduleId: "m2",
    name: "Linear Algebra",
    description: "Introduction to vectors, matrices, and linear transformations.",
  }
  const subModule3_1: SubModule = {
    id: "sm3_1",
    moduleId: "m3",
    name: "Web Development Basics",
    description: "HTML, CSS, and JavaScript fundamentals.",
  }
  const subModule3_2: SubModule = {
    id: "sm3_2",
    moduleId: "m3",
    name: "React Framework",
    description: "Building user interfaces with React components.",
  }

  const module1: Module = {
    id: "m1",
    name: "Computer Science Fundamentals",
    subModules: [subModule1_1, subModule1_2],
  }
  const module2: Module = {
    id: "m2",
    name: "Mathematics for Engineers",
    subModules: [subModule2_1, subModule2_2],
  }
  const module3: Module = {
    id: "m3",
    name: "Software Engineering",
    subModules: [subModule3_1, subModule3_2],
  }

  return {
    students: [student1, student2],
    modules: [module1, module2, module3],
    submissions: [],
  }
}
