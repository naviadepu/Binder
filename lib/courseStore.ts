import { create } from 'zustand';

export interface Course {
  id: string;
  courseCode: string;
  title: string;
  description: string;
  credits: number;
  enrolled?: boolean;
}

interface CourseStore {
  enrolledCourses: Course[];
  addCourses: (courses: Course[]) => void;
  clearCourses: () => void;
}

export const useCourseStore = create<CourseStore>((set) => ({
  enrolledCourses: [],
  addCourses: (courses) => set({ enrolledCourses: courses }),
  clearCourses: () => set({ enrolledCourses: [] }),
})); 