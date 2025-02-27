import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { getSubjects } from '../../services/subjectService';
import { getClasses } from '../../services/classService';
import { getStudents } from '../../services/studentService';
import {getClassScheduleById} from '../../services/classscheduleService'

const Attendance = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedClass, setSelectedClass] = useState("Lớp A");
    const [selectedSubject, setSelectedSubject] = useState("Toán");
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);
    const [fclasses, setfClasses] = useState([]);
    const [qrData, setQrData] = useState("");
    const [showQRModal, setShowQRModal] = useState(false);
    const navigate = useNavigate();
    
    const [selectedDate, setSelectedDate] = useState(() => {
        return new Date().toISOString().split("T")[0];
    });

    useEffect(() => {
        async function fetchData() {
            const dataMH = await getSubjects();
            const dataCls = await getClasses();
            const dataSV = await getStudents();
        
            if (Array.isArray(dataMH) && Array.isArray(dataCls) && Array.isArray(dataSV)) {
                setSubjects(dataMH.map(subject => subject.ten_mon));
                setClasses(dataCls.map(cls => cls.ten_lop));
                setfClasses(dataCls);
                setStudents(dataSV);
            } else {
                console.error("Dữ liệu không hợp lệ:", { dataMH, dataCls, dataSV });
                setSubjects([]);
                setClasses([]);
                setStudents([]);
            }
        }
        fetchData();
    }, []);

    const handleClassChange = (e) => setSelectedClass(e.target.value);
    const handleSubjectChange = (e) => setSelectedSubject(e.target.value);
   

    const toggleStatus = (id_sinh_vien) => {
        setStudents(prev =>
            prev.map(student =>
                student.id_sinh_vien === id_sinh_vien
                    ? { ...student, status: !student.status || true } // Nếu không có `status`, mặc định thành `true`
                    : student
            )
        );
    };

    const filteredStudents = students.filter(student =>
        student.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) && (selectedClass === "" || student.id_lop === fclasses.find(cls => cls.ten_lop === selectedClass)?.id_lop)
        
    );
 

    const handleGenerateQR = () => {
        if (!selectedDate) {
            alert("Vui lòng chọn ngày điểm danh");
            return;
        }
        const baseURL = "http://localhost:3000";
        const dataToEncode = `${baseURL}/student-attendance?class=${selectedClass}&subject=${selectedSubject}&date=${selectedDate}`;
        setQrData(dataToEncode);
        setShowQRModal(true);
    };

    const handleClick = () => {
        navigate("/FaceID/input", { state: { selectedSubject } });
           console.log("TEST DU LIEU LOP:   ",selectedSubject);
    };

    const handleDateChange = (e) => setSelectedDate(e.target.value);

    const handleSaveAttendance = () => {
        if (!selectedDate) {
            alert("Vui lòng chọn ngày điểm danh");
            return;
        }
        setStudents(prevStudents =>
            prevStudents.map(student => ({ ...student, date: selectedDate }))
        );
        alert("Điểm danh đã được lưu thành công!");
    };

    return (
        <div className="min-h-screen from-blue-800 to-white text-black flex flex-col">
            <Header />
            <div className="p-6 bg-gray-100 min-h-screen text-black">
                <h1 className="text-xl md:text-3xl font-bold text-black text-center">Điểm danh sinh viên</h1>
                <div className="mt-4 flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sinh viên..."
                        className="px-4 py-2 border rounded-lg shadow-sm w-full focus:ring focus:ring-blue-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300 w-full md:w-auto"
                        value={selectedClass}
                        onChange={handleClassChange}
                    >
                        <option value="">Chọn Lớp</option>
                        {classes.map((cls, index) => (
                            <option key={index} value={cls}>{cls}</option>
                        ))}
                    </select>
                    <select
                        className="px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300 w-full md:w-auto"
                        value={selectedSubject}
                        onChange={handleSubjectChange}
                    >
                        <option value="">Chọn môn học</option>
                        {subjects.map((subj, index) => (
                            <option key={index} value={subj}>{subj}</option>
                        ))}
                    </select>
                    <button onClick={handleGenerateQR} className="px-3 py-1 bg-blue-600 text-white rounded-md">
                        Tạo QR
                    </button>
                    <button onClick={handleClick} className="px-3 py-1 bg-blue-600 text-white rounded-md">
                        Điểm danh KM
                    </button>
                </div>

                <div className="mt-6 bg-white p-4 rounded-lg shadow-lg overflow-x-auto">
                    {filteredStudents.length === 0 ? (
                        <p className="text-gray-500 text-center">Không tìm thấy sinh viên...</p>
                    ) : (
                        <table className="w-full border-collapse border">
                            <thead>
                                <tr className="bg-gray-200 text-center">
                                    <th className="p-2">STT</th>
                                    <th className="p-2">MSSV</th>
                                    <th className="p-2">Họ và Tên</th>
                                    <th className="p-2">Ngày</th>
                                    <th className="p-2">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student, index) => (
                                    <tr key={student.id_sinh_vien} className="border-b hover:bg-gray-100 text-center">
                                        <td className="p-2">{index + 1}</td>
                                        <td className="p-2">{student.mssv}</td>
                                        <td className="p-2 text-center">{student.ho_ten}</td>
                                        <td className="p-2">{selectedDate}</td>
                                        <td className="p-2 flex items-center justify-center">
                                            <input 
                                                type="checkbox" 
                                                checked={!!student.status} 
                                                onChange={() => toggleStatus(student.id_sinh_vien)} 
                                                className="mr-2" 
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    
                    {showQRModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full">
                                <h2 className="text-2xl font-bold text-center text-blue-600">Mã QR Điểm Danh</h2>
                                <div className="flex justify-center my-4">
                                    <QRCodeCanvas value={qrData} size={300} className="rounded-lg shadow-lg border border-gray-300 p-2" />
                                </div>
                                <button onClick={() => setShowQRModal(false)} className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg w-full hover:bg-red-600">Đóng</button>
                            </div>
                        </div>
                    )}

                    <button onClick={handleSaveAttendance} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 w-full md:w-auto">
                        Lưu điểm danh
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
