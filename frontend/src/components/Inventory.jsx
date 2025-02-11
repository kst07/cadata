import { useState, useEffect } from "react";
import AxiosInstance from "./AxiosInstance";
import { Box, Button, Typography, Grid, Card, CardContent, CardMedia, IconButton, Paper, Container, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Snackbar, Alert } from "@mui/material";
import { motion } from "framer-motion";
import { ShoppingCart, Delete, Add, Remove } from "@mui/icons-material";

const categories = [
    { label: "ทั้งหมด", value: "all" },
    { label: "กาแฟ", value: "coffee" },
    { label: "ช็อคโกแลต", value: "chocolate" },
    { label: "โกโก้", value: "cocoa" },
    { label: "ชา", value: "tea" },
    { label: "นม", value: "milk" },
    { label: "ขนม", value: "bakery" }
];

const Inventory = () => {
    const [cart, setCart] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [products, setProducts] = useState([]);
    const [clientSecret, setClientSecret] = useState(null); // Add state for clientSecret
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");


    useEffect(() => {
        AxiosInstance.get('api/products/')
            .then((response) => {
                console.log(" Products Data:", response.data);
                setProducts(response.data);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    }, []);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                if (existingItem.quantity < product.stock) {
                    return prevCart.map(item =>
                        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                } else {
                    setSnackbarMessage("จำนวนสินค้าทั้งหมดไม่เพียงพอ");
                    setSnackbarOpen(true);
                    return prevCart;
                }
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        setSnackbarMessage(`${product.name} ถูกเพิ่มลงในตะกร้า`);
        setSnackbarOpen(true);
    };

    const removeFromCart = (index) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    const increaseQuantity = (index) => {
        const updatedCart = [...cart];
        const item = updatedCart[index];
        if (item.quantity < item.stock) {
            updatedCart[index].quantity += 1;
            setCart(updatedCart);
        } else {
            setSnackbarMessage("จำนวนสินค้าทั้งหมดไม่เพียงพอ");
            setSnackbarOpen(true);
        }
    };

    const decreaseQuantity = (index) => {
        const updatedCart = [...cart];
        if (updatedCart[index].quantity > 1) {
            updatedCart[index].quantity -= 1;
            setCart(updatedCart);
        } else {
            removeFromCart(index);
        }
    };

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const placeOrder = () => {
        if (cart.length === 0) {
            setSnackbarSeverity("error");
            setSnackbarMessage("ตะกร้าว่างเปล่า!");
            setSnackbarOpen(true);
            return;
        }
    
        // สร้างข้อมูล order ที่จะส่งไปยัง backend
        const orderData = {
            total_price: totalPrice, // ราคารวม
            items: cart.map(item => ({
                product_id: item.id, 
                quantity: item.quantity, 
                price: item.price
            }))
        };
    
        AxiosInstance.post("api/create-order/", orderData)
            .then((response) => {
                console.log("Order Response:", response.data);
                
                // ตรวจสอบว่ามี order_id ที่ได้รับกลับมาหรือไม่
                if (response.data.order_id) {
                    setSnackbarSeverity("success");
                    setSnackbarMessage("สั่งซื้อสำเร็จ! รหัสคำสั่งซื้อ #" + response.data.order_id);
                    setCart([]); // ล้างตะกร้าหลังจากสั่งซื้อสำเร็จ
                } else {
                    setSnackbarSeverity("error");
                    setSnackbarMessage("สั่งซื้อสำเร็จ แต่ไม่ได้รับรหัสคำสั่งซื้อ");
                }
    
                setSnackbarOpen(true);
            })
            .catch((error) => {
                console.error("Order Error:", error.response?.data || error);
            
                let errorMessage = "เกิดข้อผิดพลาด";
            
                if (error.response) {
                    errorMessage = error.response.data?.message || JSON.stringify(error.response.data);
                } else if (error.request) {
                    errorMessage = "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้";
                } else {
                    errorMessage = error.message;
                }
            
                setSnackbarSeverity("error");
                setSnackbarMessage("ไม่สามารถทำการสั่งซื้อได้: " + errorMessage);
                setSnackbarOpen(true);
            });
            
    };
    
    
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container>
            <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", mb: 3, color: "#4E342E" }}>
                ขายหน้าร้าน
            </Typography>

            <Divider sx={{ mb: 2}} />

            {/* ปุ่มเลือกหมวดหมู่ */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                {categories.map((category) => (
                    <Button
                        key={category.value}
                        variant={selectedCategory === category.value ? "contained" : "outlined"}
                        onClick={() => {
                            console.log(`กำลังแสดงหมวดหมู่: ${category.value}`);
                            setSelectedCategory(category.value);
                        }}
                        sx={{ 
                            mx: 1, 
                            textTransform: "none", 
                            fontWeight: 500,
                            borderRadius: "80px", // ทำให้โค้งมากขึ้น
                            padding: "4px 10px", // เพิ่ม padding เพื่อให้ดูสมส่วน
                            backgroundColor: selectedCategory === category.value ? "#6D4C41" : "transparent",
                            color: selectedCategory === category.value ? "#FFF" : "#6D4C41",
                            borderColor: "#6D4C41",
                            '&:hover': {
                                backgroundColor: "#6D4C41",
                                color: "#FFF",
                                borderColor: "#6D4C41",
                            }
                        }}
                    >
                        {category.label}
                    </Button>
                ))}
            </Box>

            <Grid container spacing={3}>
                {/* ส่วนแสดงสินค้า */}
                <Grid item xs={12} md={8}>
                    <Grid container spacing={3} sx={{ marginBottom: 4 }}>
                        {products
                            .filter((product) => selectedCategory === "all" || product.category === selectedCategory)
                            .map((product) => (
                                <Grid item xs={12} sm={6} md={4} key={product.id}>
                                    <Card 
                                        component={motion.div} 
                                        whileHover={{ scale: 1.05 }} 
                                        sx={{ 
                                            borderRadius: 4, 
                                            boxShadow: 5,
                                            backgroundColor: "#FFF8E1",
                                            transition: "transform 0.3s ease-in-out",
                                            '&:hover': {
                                                transform: "translateY(-5px)",
                                            }
                                        }}
                                    >
                                        <CardMedia 
                                            component="img" 
                                            height="150" 
                                            image={product.image} 
                                            alt={product.name} 
                                            sx={{ borderTopLeftRadius: 10, borderTopRightRadius: 5 }}
                                        />
                                        <CardContent sx={{ textAlign: "center" }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: "#4E342E" }}>{product.name}</Typography>
                                            <Typography sx={{ color: "text.secondary", mb: 1 }}>
                                                ราคา: {product.price}฿ | คงเหลือ: {product.stock}
                                            </Typography>
                                            <Button 
                                                variant="contained" 
                                                color="success" 
                                                onClick={() => addToCart(product)}
                                                sx={{
                                                    backgroundColor: "#6D4C41",
                                                    '&:hover': {
                                                        backgroundColor: "#4E342E",
                                                    }
                                                }}
                                            >
                                                เลือก
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                    </Grid>
                </Grid>

                {/* ส่วนตะกร้าสินค้า */}
                <Grid item xs={12} md={4}>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Paper 
                            sx={{ 
                                maxWidth: 400, 
                                width: "100%", 
                                padding: 2, 
                                boxShadow: 4, 
                                backgroundColor: "#8D6E63", 
                                color: "#FFF", 
                                borderRadius: 4 
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: "bold", display: "flex", alignItems: "center", mb: 2, color: "#FFF" }}>
                                <ShoppingCart sx={{ mr: 1.5 }} /> ตะกร้าสินค้า
                            </Typography>
                            <Divider sx={{ my: 1, borderColor: "#FFF" }} />
                            {cart.length > 0 ? (
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ color: "#FFF" }}>สินค้า</TableCell>
                                                <TableCell sx={{ color: "#FFF" }}>จำนวน</TableCell>
                                                <TableCell align="right" sx={{ color: "#FFF" }}>ราคา</TableCell>
                                                <TableCell align="right" sx={{ color: "#FFF" }}>ลบ</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {cart.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell sx={{ color: "#FFF" }}>{item.name}</TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                                            <IconButton onClick={() => decreaseQuantity(index)} sx={{ color: "#FFF" }}>
                                                                <Remove />
                                                            </IconButton>
                                                            {item.quantity}
                                                            <IconButton onClick={() => increaseQuantity(index)} sx={{ color: "#FFF" }}>
                                                                <Add />
                                                            </IconButton>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ color: "#FFF" }}>{item.price * item.quantity} ฿</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton color="error" onClick={() => removeFromCart(index)} sx={{ color: "#FFF" }}>
                                                            <Delete />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Typography textAlign="center" sx={{ color: "#FFF" }}>ไม่มีสินค้าในตะกร้า</Typography>
                            )}
                            <Divider sx={{ my: 2, borderColor: "#FFF" }} />
                            <Typography variant="h6" textAlign="center" sx={{ color: "#FFF" }}>รวมทั้งหมด: {totalPrice} ฿</Typography>
                            <Button variant="contained" sx={{ width: "100%", mt: 2, backgroundColor: "#734620" , '&:hover': { backgroundColor: "#4E342E" }}} onClick={placeOrder}>
                                ชำระเงิน
                            </Button>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>

            <Snackbar 
                    open={snackbarOpen} 
                    autoHideDuration={3000} 
                    onClose={handleCloseSnackbar} 
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                    <Alert 
                        onClose={handleCloseSnackbar} 
                        severity={snackbarSeverity} 
                        sx={{ 
                        width: "100%", 
                        maxWidth: 400,
                        fontSize: 15,
                        backgroundColor: snackbarSeverity === "success" ? "#C8E6C9" : "#FFCDD2", 
                        color: snackbarSeverity === "success" ? "#2E7D32" : "#D32F2F",
                        borderRadius: 2,
                        }}
                    >
                        {snackbarMessage}
                    </Alert>
            </Snackbar>

        </Container>
    )
}

export default Inventory;
