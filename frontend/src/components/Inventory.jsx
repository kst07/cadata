import { useState } from "react";
import {
    Box,
    Button,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Snackbar,
    Alert,
    CardMedia,
    IconButton,
    Paper,
    TextField,
    Container,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { Add, Remove, ShoppingCart, Delete } from "@mui/icons-material";

const Inventory = () => {
    const [products, setProducts] = useState([
        {
            id: 1,
            name: "Espresso",
            priceOptions: { iced: 60, blended: 70 },
            stock: 10,
            image: "https://via.placeholder.com/150",
        },
        {
            id: 2,
            name: "Latte",
            priceOptions: { iced: 80, blended: 90 },
            stock: 8,
            image: "https://via.placeholder.com/150",
        },
        {
            id: 3,
            name: "Mocha",
            priceOptions: { iced: 85, blended: 95 },
            stock: 6,
            image: "https://via.placeholder.com/150",
        },
    ]);
    const [cart, setCart] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [quantities, setQuantities] = useState({});

    const handleQuantityChange = (id, value) => {
        const newQuantity = Math.max(1, parseInt(value) || 1);
        setQuantities({ ...quantities, [id]: newQuantity });
    };

    const incrementQuantity = (id) => {
        setQuantities({
            ...quantities,
            [id]: (quantities[id] || 1) + 1,
        });
    };

    const decrementQuantity = (id) => {
        setQuantities({
            ...quantities,
            [id]: Math.max(1, (quantities[id] || 1) - 1),
        });
    };

    const addToCart = (product, option) => {
        const quantity = quantities[product.id] || 1;
        const existingItem = cart.find(
            (item) => item.id === product.id && item.option === option
        );

        if (product.stock >= quantity) {
            if (existingItem) {
                setCart(
                    cart.map((item) =>
                        item.id === product.id && item.option === option
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    )
                );
            } else {
                setCart([
                    ...cart,
                    {
                        ...product,
                        option,
                        price: product.priceOptions[option],
                        quantity,
                    },
                ]);
            }
            setProducts(
                products.map((p) =>
                    p.id === product.id
                        ? { ...p, stock: p.stock - quantity }
                        : p
                )
            );
            setSnackbarMessage(`${product.name} (${option}) added to cart!`);
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } else {
            setSnackbarMessage(`Not enough stock for ${product.name}!`);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const removeFromCart = (index) => {
        const removedItem = cart[index];
        setCart(cart.filter((_, i) => i !== index));
        setProducts(
            products.map((p) =>
                p.id === removedItem.id
                    ? { ...p, stock: p.stock + removedItem.quantity }
                    : p
            )
        );
        setSnackbarMessage(`${removedItem.name} removed from cart!`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
    };

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const checkout = () => {
        setCart([]);
        setSnackbarMessage("Checkout successful!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
    };

    return (
        <Container sx={{ padding: 3, position: "relative" }}>
            <Typography
                variant="h4"
                sx={{ fontWeight: "bold", marginBottom: 3, textAlign: "center" }}
            >
                Coffee Menu
            </Typography>

            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <Card
                            component={motion.div}
                            whileHover={{ scale: 1.05 }}
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                borderRadius: 2,
                                boxShadow: 3,
                                overflow: "hidden",
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="160"
                                image={product.image}
                                alt={product.name}
                            />
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: "bold", textAlign: "center" }}
                                >
                                    {product.name}
                                </Typography>
                                <Typography
                                    sx={{
                                        textAlign: "center",
                                        marginBottom: 1,
                                        color: "text.secondary",
                                    }}
                                >
                                    Iced: ฿{product.priceOptions.iced} | Blended: ฿{product.priceOptions.blended}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: product.stock > 0 ? "success.main" : "error.main",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                    }}
                                >
                                    {product.stock > 0
                                        ? `In Stock: ${product.stock}`
                                        : "Out of Stock"}
                                </Typography>

                                {product.stock > 0 && (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginTop: 2,
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            onClick={() => addToCart(product, "iced")}
                                            sx={{ flexGrow: 1, marginRight: 1 }}
                                        >
                                            Iced
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={() => addToCart(product, "blended")}
                                            sx={{ flexGrow: 1 }}
                                        >
                                            Blended
                                        </Button>
                                    </Box>
                                )}

                                <Box sx={{ display: "flex", marginTop: 2 }}>
                                    <IconButton onClick={() => decrementQuantity(product.id)}>
                                        <Remove />
                                    </IconButton>
                                    <TextField
                                        type="number"
                                        label="Qty"
                                        value={quantities[product.id] || 1}
                                        onChange={(e) =>
                                            handleQuantityChange(product.id, e.target.value)
                                        }
                                        sx={{ width: 80 }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => incrementQuantity(product.id)}
                                                    >
                                                        <Add />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Paper
                sx={{
                    position: "fixed",
                    top: 16,
                    right: 16,
                    width: 350,
                    padding: 2,
                    maxHeight: "80vh",
                    overflowY: "auto",
                    boxShadow: 4,
                    borderRadius: 3,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 2,
                    }}
                >
                    <ShoppingCart sx={{ marginRight: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Shopping Cart
                    </Typography>
                </Box>

                <Divider sx={{ marginBottom: 2 }} />

                {cart.length > 0 ? (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Item</TableCell>
                                    <TableCell align="center">Option</TableCell>
                                    <TableCell align="center">Qty</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cart.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell align="center">{item.option}</TableCell>
                                        <TableCell align="center">
                                            {item.quantity}
                                        </TableCell>
                                        <TableCell align="right">
                                            ฿{item.price * item.quantity}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                color="error"
                                                onClick={() => removeFromCart(index)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography>No items in the cart</Typography>
                )}

                {cart.length > 0 && (
                    <Box sx={{ marginTop: 2 }}>
                        <Typography
                            variant="h6"
                            sx={{ textAlign: "center", fontWeight: "bold" }}
                        >
                            Total: ฿{totalPrice}
                        </Typography>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={checkout}
                            sx={{ width: "100%", marginTop: 2 }}
                        >
                            Checkout
                        </Button>
                    </Box>
                )}
            </Paper>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Inventory;
