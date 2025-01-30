import React from "react";
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Card,
  CardContent,
  LinearProgress
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// ข้อมูลตัวอย่างสำหรับกราฟและตาราง
const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 2000 },
  { name: "Apr", sales: 2780 },
  { name: "May", sales: 1890 },
  { name: "Jun", sales: 2390 },
  { name: "Jul", sales: 3490 },
];

const topProducts = [
  { name: "Espresso", sales: 1200 },
  { name: "Latte", sales: 980 },
  { name: "Cappuccino", sales: 750 },
  { name: "Americano", sales: 600 },
  { name: "Mocha", sales: 500 },
];

const SalesSummary = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* หัวข้อหน้า */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#4E342E" }}>
        สรุปยอดขาย
      </Typography>

      {/* กราฟสรุปยอดขาย */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#6D4C41" }}>
          ยอดขายรายเดือน
        </Typography>
        <BarChart width={800} height={300} data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#8D6E63" />
        </BarChart>
      </Paper>

      {/* การ์ดแสดงข้อมูลสรุป */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#6D4C41" }}>
                ยอดขายรวม
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#4E342E" }}>
                ฿ 25,000
              </Typography>
              <LinearProgress variant="determinate" value={70} sx={{ mt: 2, height: 10, borderRadius: 5 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#6D4C41" }}>
                จำนวนคำสั่งซื้อ
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#4E342E" }}>
                120
              </Typography>
              <LinearProgress variant="determinate" value={50} sx={{ mt: 2, height: 10, borderRadius: 5 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#6D4C41" }}>
                ลูกค้าใหม่
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#4E342E" }}>
                25
              </Typography>
              <LinearProgress variant="determinate" value={30} sx={{ mt: 2, height: 10, borderRadius: 5 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ตารางสินค้าขายดี */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#6D4C41" }}>
          สินค้าขายดี
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "#4E342E" }}>สินค้า</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold", color: "#4E342E" }}>ยอดขาย (บาท)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topProducts.map((product) => (
                <TableRow key={product.name}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell align="right">฿ {product.sales}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default SalesSummary;