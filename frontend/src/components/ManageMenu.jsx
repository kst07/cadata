import { useState, useEffect } from "react"
import AxiosInstance from "./AxiosInstance"
import {Box,TextField,Button,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,IconButton,FormControl,
InputLabel,Select,MenuItem,Typography,Snackbar,Alert,Dialog,DialogActions,DialogContent,DialogTitle,Pagination,} from "@mui/material"
import { Edit, Delete, Add } from "@mui/icons-material"

const ManageMenu = () => {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [image, setImage] = useState("")
  const [products, setProducts] = useState([])
  const [open, setOpen] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [page, setPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    AxiosInstance.get("/api/products/")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า:", error))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newProduct = { name, category, price, stock, image }
    AxiosInstance.post("/api/products/", newProduct)
      .then((response) => {
        setProducts([...products, response.data])
        setName("")
        setCategory("")
        setPrice("")
        setStock("")
        setImage("")
        setOpen(false)
        setSnackbarMessage("สินค้าถูกเพิ่มแล้ว!")
        setSnackbarSeverity("success")
        setSnackbarOpen(true)
      })
      .catch(() => {
        setSnackbarMessage("เกิดข้อผิดพลาดในการเพิ่มสินค้า")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      })
  }

  const handleDelete = (id) => {
    AxiosInstance.delete(`/api/products/${id}/`)
      .then(() => {
        setProducts(products.filter((product) => product.id !== id))
        setSnackbarMessage("สินค้าถูกลบแล้ว!")
        setSnackbarSeverity("success")
        setSnackbarOpen(true)
      })
      .catch(() => {
        setSnackbarMessage("เกิดข้อผิดพลาดในการลบสินค้า")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      })
  }

  const handleEditOpen = (product) => {
    setEditProduct(product)
    setOpenEditDialog(true)
  }

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedProduct = { 
      name: editProduct.name, 
      category: editProduct.category, 
      price: editProduct.price, 
      stock: editProduct.stock, 
      image: editProduct.image, 
    };
    AxiosInstance.put(`/api/products/${editProduct.id}/`, updatedProduct)
      .then((response) => {
        setProducts(products.map((product) => product.id === editProduct.id ? response.data : product))
        setSnackbarMessage("ข้อมูลสินค้าถูกอัพเดตแล้ว!")
        setSnackbarSeverity("success")
        setSnackbarOpen(true)
        setOpenEditDialog(false)
      })
      .catch(() => {
        setSnackbarMessage("เกิดข้อผิดพลาดในการอัพเดตข้อมูลสินค้า")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      })
  }

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = products.slice(startIndex, endIndex)

  return (
    <Box sx={{ padding: 3, backgroundColor: "#F5F5F5", borderRadius: 3 }}>
      <Typography variant="h4" fontWeight="bold" color="#4E342E" gutterBottom>
        ManageMenu
      </Typography>

      <Button 
        variant="contained" 
        sx={{ 
          backgroundColor: "#6D4C41", 
          color: "#FFF", 
          "&:hover": { backgroundColor: "#8D6E63" }, 
          mb: 2 
        }} 
        startIcon={<Add />} 
        onClick={() => setOpen(true)}
      >
        เพิ่มสินค้า
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ backgroundColor: "#D7CCC8", color: "#4E342E" }}>เพิ่มสินค้าใหม่</DialogTitle>
        <DialogContent sx={{ backgroundColor: "#EFEBE9" }}>
          <TextField 
            label="ชื่อเมนู" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            fullWidth 
            margin="normal" 
            sx={{ backgroundColor: "#FFF", borderRadius: 1 }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>หมวดหมู่</InputLabel>
            <Select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              label="หมวดหมู่"
              sx={{ backgroundColor: "#FFF", borderRadius: 1 }}
            >
              <MenuItem value="coffee">กาแฟ</MenuItem>
              <MenuItem value="chocolate">ช็อคโกแลต</MenuItem>
              <MenuItem value="cocoa">โกโก้</MenuItem>
              <MenuItem value="tea">ชา</MenuItem>
              <MenuItem value="milk">นม</MenuItem>
              <MenuItem value="bakery">ขนม</MenuItem>
            </Select>
          </FormControl>
          <TextField 
            label="ราคา (บาท)" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            type="number" 
            fullWidth 
            margin="normal" 
            sx={{ backgroundColor: "#FFF", borderRadius: 1 }}
          />
          <TextField 
            label="จำนวนสินค้า" 
            value={stock} 
            onChange={(e) => setStock(e.target.value)} 
            type="number" 
            fullWidth 
            margin="normal" 
            sx={{ backgroundColor: "#FFF", borderRadius: 1 }}
          />
          <TextField 
            label="URL รูปภาพ" 
            value={image} 
            onChange={(e) => setImage(e.target.value)} 
            fullWidth 
            margin="normal" 
            sx={{ backgroundColor: "#FFF", borderRadius: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#D7CCC8" }}>
          <Button onClick={() => setOpen(false)} color="secondary">ยกเลิก</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: "#6D4C41", color: "#FFF" }}>เพิ่มสินค้า</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle sx={{ backgroundColor: "#D7CCC8", color: "#4E342E" }}>แก้ไขสินค้า</DialogTitle>
        <DialogContent sx={{ backgroundColor: "#EFEBE9" }}>
          <TextField 
            label="ชื่อเมนู" 
            value={editProduct?.name || ''} 
            onChange={(e) => setEditProduct({...editProduct, name: e.target.value})} 
            fullWidth 
            margin="normal" 
            sx={{ backgroundColor: "#FFF", borderRadius: 1 }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>หมวดหมู่</InputLabel>
            <Select 
              value={editProduct?.category || ''} 
              onChange={(e) => setEditProduct({...editProduct, category: e.target.value})} 
              label="หมวดหมู่"
              sx={{ backgroundColor: "#FFF", borderRadius: 1 }}
            >
              <MenuItem value="coffee">กาแฟ</MenuItem>
              <MenuItem value="chocolate">ช็อคโกแลต</MenuItem>
              <MenuItem value="cocoa">โกโก้</MenuItem>
              <MenuItem value="tea">ชา</MenuItem>
              <MenuItem value="milk">นม</MenuItem>
              <MenuItem value="bakery">ขนม</MenuItem>
            </Select>
          </FormControl>
          <TextField 
            label="ราคา (บาท)" 
            value={editProduct?.price || ''} 
            onChange={(e) => setEditProduct({...editProduct, price: e.target.value})} 
            type="number" 
            fullWidth 
            margin="normal" 
            sx={{ backgroundColor: "#FFF", borderRadius: 1 }}
          />
          <TextField 
            label="จำนวนสินค้า" 
            value={editProduct?.stock || ''} 
            onChange={(e) => setEditProduct({...editProduct, stock: e.target.value})} 
            type="number" 
            fullWidth 
            margin="normal" 
            sx={{ backgroundColor: "#FFF", borderRadius: 1 }}
          />
          <TextField 
            label="URL รูปภาพ" 
            value={editProduct?.image || ''} 
            onChange={(e) => setEditProduct({...editProduct, image: e.target.value})} 
            fullWidth 
            margin="normal" 
            sx={{ backgroundColor: "#FFF", borderRadius: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#D7CCC8" }}>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">ยกเลิก</Button>
          <Button onClick={handleEditSubmit} variant="contained" sx={{ backgroundColor: "#6D4C41", color: "#FFF" }}>บันทึกการแก้ไข</Button>
        </DialogActions>
      </Dialog>

      <Paper elevation={3} sx={{ overflow: "hidden", borderRadius: 3, width: "100%", backgroundColor: "#FFF8F0" }}>
        <TableContainer sx={{ minWidth: 1200 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#D7CCC8" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "#4E342E" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#4E342E" }}>รูปภาพ</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#4E342E" }}>ชื่อเมนู</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#4E342E" }}>หมวดหมู่</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#4E342E" }}>ราคา</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#4E342E" }}>จำนวนสินค้า</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#4E342E" }}>การจัดการ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.id} hover sx={{ "&:hover": { backgroundColor: "#F5F5F5" } }}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>
                    {product.image? (
                      <img src={product.image}  width="60" height="50" style={{ borderRadius: 10 }} />
                    ) : (
                      <Typography color="textSecondary">ไม่มีรูป</Typography>
                    )}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price} ฿</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditOpen(product)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(product.id)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
        <Pagination
          count={Math.ceil(products.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          sx={{ "& .MuiPaginationItem-root": { color: "#6D4C41" } }}
        />
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity} 
          sx={{ 
            width: "100%", 
            backgroundColor: snackbarSeverity === "success" ? "#C8E6C9" : "#FFCDD2", 
            color: snackbarSeverity === "success" ? "#2E7D32" : "#D32F2F",
            borderRadius: 2,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ManageMenu