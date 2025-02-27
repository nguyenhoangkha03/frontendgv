import { useState, useEffect } from "react";
import Header from "../../components/Header";

const subjectParts = ["Đại số", "Hình học", "Cơ học", "Điện học", "Văn học cổ", "Văn học hiện đại"];
const classes = ["Lớp 1", "Lớp 2", "Lớp 3"];

const studentsData = [
    { id: 1, mssv: "SV001", name: "Nguyễn Văn A", class: "Lớp 1", subjectPart: "Đại số", midTerm: "", finalTerm: "", total: "", gpa: "" },
    { id: 2, mssv: "SV002", name: "Trần Thị B", class: "Lớp 1", subjectPart: "Hình học", midTerm: "", finalTerm: "", total: "", gpa: "" },
    { id: 3, mssv: "SV003", name: "Lê Văn C", class: "Lớp 2", subjectPart: "Cơ học", midTerm: "", finalTerm: "", total: "", gpa: "" },
    { id: 4, mssv: "SV004", name: "Phạm Văn D", class: "Lớp 3", subjectPart: "Điện học", midTerm: "", finalTerm: "", total: "", gpa: "" },
    { id: 5, mssv: "SV005", name: "Ngô Thị E", class: "Lớp 2", subjectPart: "Văn học cổ", midTerm: "", finalTerm: "", total: "", gpa: "" },
    { id: 6, mssv: "SV006", name: "Bùi Văn F", class: "Lớp 1", subjectPart: "Văn học hiện đại", midTerm: "", finalTerm: "", total: "", gpa: "" },
    { id: 7, mssv: "SV007", name: "Đào Thị G", class: "Lớp 2", subjectPart: "Vô cơ", midTerm: "", finalTerm: "", total: "", gpa: "" },
    { id: 8, mssv: "SV008", name: "Nguyễn Văn H", class: "Lớp 3", subjectPart: "Hữu cơ", midTerm: "", finalTerm: "", total: "", gpa: "" },
]


const getLetterGrade = (gpa) => {
    if (gpa >= 3.6) return "A";
    if (gpa >= 3.2) return "B+";
    if (gpa >= 2.8) return "B";
    if (gpa >= 2.4) return "C+";
    if (gpa >= 2.0) return "C";
    if (gpa >= 1.6) return "D+";
    if (gpa >= 1.0) return "D";
    return "F";
};

export default function Grades() {
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedPart, setSelectedPart] = useState("");
    const [grades, setGrades] = useState([...studentsData]);
    const [searchMSSV, setSearchMSSV] = useState("");

    useEffect(() => {
        const filtered = studentsData.filter(student =>
            (!selectedClass || student.class === selectedClass) &&
            (!selectedPart || student.subjectPart === selectedPart)
        );
        setGrades(filtered);
    }, [selectedClass, selectedPart]);

    const handleGradeChange = (id, field, value) => {
        const numericValue = value === "" ? "" : parseFloat(value);
        setGrades((prevGrades) =>
            prevGrades.map((student) => {
                if (student.id === id) {
                    const updatedStudent = { ...student, [field]: numericValue };
                    const midTerm = parseFloat(updatedStudent.midTerm) || 0;
                    const finalTerm = parseFloat(updatedStudent.finalTerm) || 0;

                    if (updatedStudent.midTerm === "" || updatedStudent.finalTerm === "") {
                        updatedStudent.total = "";
                        updatedStudent.gpa = "";
                    } else {
                        updatedStudent.total = ((midTerm * 0.4 + finalTerm * 0.6) / 10 * 4).toFixed(2);
                        updatedStudent.gpa = getLetterGrade(parseFloat(updatedStudent.total));
                    }
                    return updatedStudent;
                }
                return student;
            })
        );
    };
    useEffect(() => {
        const filtered = studentsData.filter(student =>
            (!selectedClass || student.class === selectedClass) &&
            (!selectedPart || student.subjectPart === selectedPart) &&
            (!searchMSSV || student.mssv.toLowerCase().includes(searchMSSV.toLowerCase()))
        );
        setGrades(filtered);
    }, [selectedClass, selectedPart, searchMSSV]);
    
    //nút lưu
    const handleSave = () => {
        localStorage.setItem("attendanceData", JSON.stringify(studentsData));
        alert("Dữ liệu đã được lưu thành công!");
    };
    // nút edit
    const handleEdit = (id, newName) => {
        studentsData((prev) =>
            prev.map((student) =>
                student.id === id ? { ...student, name: newName } : student
            )
        );
    };

    return (
        <div className="min-h-screen from-blue-800  text-gray-800 flex flex-col">
            <Header />

            {/* Bộ lọc */}
            <div className="p-5">
           
            <h1 className="text-2xl font-bold mb-2 text-center">Danh sách sinh viên</h1>
                <div className="p-4 flex flex-col md:flex-row  gap-4">
                    <input
                        type="text"
                        placeholder="Nhập MSSV..."
                        className="px-3 py-2 border rounded-lg shadow-md bg-white focus:ring-2 focus:ring-blue-400"
                        value={searchMSSV}
                        onChange={(e) => setSearchMSSV(e.target.value)}
                    />

                    <select
                        className="px-3 py-2 border rounded-lg shadow-md bg-white focus:ring-2 focus:ring-blue-400"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                    >
                        <option value="">Chọn lớp</option>
                        {classes.map((cls) => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>

                    <select
                        className="px-3 py-2 border rounded-lg shadow-md bg-white focus:ring-2 focus:ring-blue-400"
                        value={selectedPart}
                        onChange={(e) => setSelectedPart(e.target.value)}
                    >
                        <option value="">Chọn môn học phần</option>
                        {subjectParts.map((part) => (
                            <option key={part} value={part}>{part}</option>
                        ))}
                    </select>
                </div>

                {/* Bảng điểm */}
                <div className="p-4  overflow-y-auto">
                    <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-blue-600 text-white">
                                <th className="p-3 text-center">STT</th>
                                <th className="p-3 text-center">MSSV</th>
                                <th className="p-3 text-center">Tên sinh viên</th>
                                <th className="p-3 text-center">Giữa kỳ</th>
                                <th className="p-3 text-center">Cuối kỳ</th>
                                <th className="p-3 text-center">Tổng kết</th>
                                <th className="p-3 text-center">Điểm chữ</th>
                                <th className="p-3 text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {grades.length > 0 ? (
                                grades.map((student, index) => (
                                    <tr key={student.id} className="border-b text-center hover:bg-blue-50 transition">
                                        <td className="p-2 text-center">{index + 1}</td>
                                        <td className="p-2">{student.mssv}</td>
                                        <td className="p-2 text-center">{student.name}</td>
                                        <td className="p-2">
                                            <input
                                                type="number"
                                                min="0"
                                                max="10"
                                                step="0.1"
                                                className="border p-1 rounded w-16 text-center focus:ring-2 focus:ring-blue-400"
                                                value={student.midTerm || ""}
                                                onChange={(e) => handleGradeChange(student.id, "midTerm", e.target.value)}
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="number"
                                                min="0"
                                                max="10"
                                                step="0.1"
                                                className="border p-1 rounded w-16 text-center focus:ring-2 focus:ring-blue-400"
                                                value={student.finalTerm || ""}
                                                onChange={(e) => handleGradeChange(student.id, "finalTerm", e.target.value)}
                                            />
                                        </td>
                                        <td className="p-2">{student.total}</td>
                                        <td className="p-2">{student.gpa}</td>
                                        <td className="px-2">
                                            <button onClick={() => handleEdit(student.id, prompt("Nhập tên mới:", student.name))} className="px-3 py-1 bg-green-500 text-white rounded shadow hover:bg-yellow-600 float-right ">Sửa</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-3 text-center text-gray-500">Chưa có dữ liệu sinh viên</td>
                                </tr>
                            )}
                    
                        </tbody>

                    
                
                
               
                    </table>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 float-right mt-2">Lưu</button>
                </div>
            </div>
        </div>
    );
}
