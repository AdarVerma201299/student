import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudents,
  updateStudent,
  deleteStudent,
} from "../../../redux/actions/adminActions";
import { clearErrors } from "../../../redux/slices/adminSlice";
import DataSheet from "../../../Components/Admin/StudentManagement/Datasheet";
import ErrorMessage from "../../../Components/Common/ErrorMessage";
import SuccessMessage from "../../../Components/Common/SuccessMessage";
import LoadingSpinner from "../../../Components/Common/LoadingSpinner";
import { DataSheetSkeleton } from "../../LoadingPage";
const StudentManagement = () => {
  const dispatch = useDispatch();
  const { students, status, error } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.auth);
  const [successMessage, setSuccessMessage] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (user && students.length === 0) {
      dispatch(
        fetchStudents({
          role: user.role,
          userId: user.id,
        })
      );
    }
  }, [dispatch, user, students]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
      const timer = setTimeout(() => {
        setLocalError("");
        dispatch(clearErrors());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleEdit = async (student) => {
    try {
      const result = await dispatch(
        updateStudent({
          id: student._id,
          studentData: student,
        })
      );

      if (updateStudent.fulfilled.match(result)) {
        setSuccessMessage("Student updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      setLocalError("Failed to update student");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const result = await dispatch(deleteStudent(id));

        if (deleteStudent.fulfilled.match(result)) {
          setSuccessMessage("Student deleted successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);

          // Optional: Re-fetch students if needed
          // await dispatch(fetchStudents());
        }
      } catch (err) {
        setLocalError(err.payload || "Failed to delete student");
      }
    }
  };

  if (status === "loading" && students.length === 0) {
    return <DataSheetSkeleton />;
  }
  // console.log(students);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Error Message */}
      {localError && (
        <ErrorMessage message={localError} onClose={() => setLocalError("")} />
      )}

      {/* Success Message */}
      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}

      {/* Main Content */}
      <DataSheet
        students={students.data}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Loading indicator when performing actions */}
      {status === "loading" && students.length > 0 && (
        <div className="mt-4">
          <LoadingSpinner size="small" />
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
