import { createContext, useContext, useState, ReactNode } from "react";

type CourseType = "illustration" | "sketch" | "ipad" | "designThinking" | "basicSewing";

interface CourseContextType {
    selectedCourse: CourseType;
    setSelectedCourse: (course: CourseType) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider = ({ children }: { children: ReactNode }) => {
    const [selectedCourse, setSelectedCourse] = useState<CourseType>("illustration");

    return (
        <CourseContext.Provider value={{ selectedCourse, setSelectedCourse }}>
            {children}
        </CourseContext.Provider>
    );
};

export const useCourse = () => {
    const context = useContext(CourseContext);
    if (!context) {
        throw new Error("useCourse must be used within CourseProvider");
    }
    return context;
};
