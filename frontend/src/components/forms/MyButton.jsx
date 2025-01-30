import * as React from 'react';
import Button from '@mui/material/Button';

export default function MyButton(props) {
  const { label, type, bgColor, textColor } = props // รับ props สำหรับสีพื้นหลังและสีข้อความ
  return (
    <Button
      type={type}
      variant="contained"
      className={"myButton"}
      sx={{
        backgroundColor: bgColor || '#734620', // กำหนดสีพื้นหลัง ถ้าไม่มีค่าใช้สีเริ่มต้น
        color: textColor || '#fff', // กำหนดสีข้อความ ถ้าไม่มีค่าใช้สีขาว
        fontFamily:" cursive",
        fontSize: "15px",
        borderRadius: "20px", // เพิ่มขอบโค้ง
        '&:hover': {
          backgroundColor: '#643D1D', // สีพื้นหลังเมื่อเมาส์ชี้
        },
      }}
    >
      {label}
    </Button>
  );
}
