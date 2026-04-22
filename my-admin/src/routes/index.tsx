import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import {StudentsPage} from '../features/students/StudentsPage';
import NotFound from '../pages/NotFound';
import { TrainingProgramPage } from '../features/training-program/TrainingProgramPage';
import { MajorsPage } from '../features/majors/MajorsPage';
import { SubjectsPage } from '../features/subjects/SubjectsPage';
import { CourseClassesPage } from '../features/course-classes/CourseClassesPage';
import { LecturersPage } from '../features/lecturers/LecturersPage';
import { SemestersPage } from '../features/semesters/SemestersPage';
import { DepartmentsPage } from '../features/departments/DepartmentsPage';
import { StudentClassesPage } from '../features/student-classes/StudentClassesPage';
import { NewsPage } from '../features/news/NewsPage';
import { RequestsPage } from '../features/applications/RequestsPage';
import { NotificationsPage } from '../features/notifications/NotificationsPage';
import { PaymentsPage } from '../features/payments/PaymentsPage';
import { ExamsPage } from '../features/exams/ExamsPage';
import { AcademicResultsPage } from '../features/academic-results/AcademicResultsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/students" element={<StudentsPage />} />
      <Route path="/programs" element={<TrainingProgramPage />} />
      <Route path="/majors" element={<MajorsPage />} />
      <Route path="/subjects" element={<SubjectsPage />} />
      <Route path="/classes" element={<CourseClassesPage />} />
      <Route path="/lecturers" element={<LecturersPage />} />
      <Route path="/semesters" element={<SemestersPage />} />
      <Route path="/departments" element={<DepartmentsPage />} />
      <Route path="/student-classes" element={<StudentClassesPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/requests" element={<RequestsPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/payments" element={<PaymentsPage />} />
      <Route path="/academic-results" element={<AcademicResultsPage />} />
      <Route path="/exams" element={<ExamsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
