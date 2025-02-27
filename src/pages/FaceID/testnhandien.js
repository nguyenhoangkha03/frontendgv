import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as XLSX from 'xlsx';
import { detectFace } from '../../services/faceService';
import "../../pages/FaceID/test.css";
import {getStudentByMssv} from '../../services/studentService';
import {getClassById} from '../../services/classService';
import {getClassScheduleById} from '../../services/classscheduleService'
import { useNavigate } from "react-router-dom";

const FaceRecognition = ({ selectedSubject }) => {
  const webcamRef = useRef(null);
  const [canCapture, setCanCapture] = useState(true);
  const [dataList, setDataList] = useState([]);
  const navigate = useNavigate();
  // console.log("Môn học nhận được:", selectedSubject);

  const handleClick = () => {
    navigate("/teacher/attendance"); 
  };


  useEffect(() => {
    const interval = setInterval(async () => {
      if (webcamRef.current && canCapture) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          setCanCapture(false);
          const result = await detectFace(imageSrc);
          if (result && result.shouldSave) {
            const data = await getStudentByMssv(result.match);
            const classed = await getClassById(data.id_lop);
            // const classschedule = await getClassScheduleById(data.id_lop);
            // console.log("Dữ liệu lớp học phần: ",classschedule);
            setDataList((prevDataList) => [
              ...prevDataList,
              { MSSV: result.match, NAME: data.ho_ten,CLASS: classed.ten_lop, MON: selectedSubject, TIME: result.time },
            ]);
          }
          setCanCapture(true);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [canCapture]);

  // Lưu file Excel
  const saveToExcel = () => {
    if (dataList.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(dataList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DanhSachDiemDanh");
    XLSX.writeFile(wb, "DiemDanh.xlsx");
  };

  return (
    <>
      <div className="Top"><h1>Nhận diện khuôn mặt</h1></div>
      <form style={{ textAlign: 'center' }} className="webcam-container">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ width: 1640, height: 1480 }}
          style={{ width: 900, height: 580, borderRadius: 10 }}
          className="webcam-flip webcam-fullscreen"
        />
      </form>
      <div className="right">
        <table border="1">
          <thead>
            <tr>
              <th>Mã số sinh viên</th>
              <th>Tên sinh viên</th>
              <th>Lớp</th>
              <th>Môn học</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((item, index) => (
              <tr key={index}>
                <td>{item.MSSV}</td>
                <td>{item.NAME}</td>
                <td>{item.CLASS}</td>
                <td>{item.MON}</td>
                <td>{item.TIME}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={saveToExcel} className="button-export">Xuất file Excel</button>
      <button onClick={handleClick} className="button-exportt">Quay lại</button>

    </>
  );
};

export default FaceRecognition;
