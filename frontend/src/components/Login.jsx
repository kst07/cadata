import React, { useState } from "react"
import axios from "axios"
import { Box, Typography, TextField, Button, Snackbar, InputAdornment, 
  IconButton,Alert } from "@mui/material";
import { useNavigate } from "react-router-dom"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import "@fontsource/pacifico"
import './cs/login.css'

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  const bgColor = "#734620"
  const textColor = "#fff"

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        username,
        password,
      });

      localStorage.setItem("access_token", response.data.access)
      localStorage.setItem("refresh_token", response.data.refresh)

      setSuccessMessage("เข้าสู่ระบบสำเร็จ!");
      setSuccessSnackbarOpen(true); // เปิด Snackbar สำหรับข้อความสำเร็จ
      setTimeout(() => {
        navigate("/home");
      }, 1000); // Navigate after 2 seconds

    } catch (error) {
      if (error.response) {
        setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง")
      } else if (error.request) {
        setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้")
      } else {
        setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ")
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessSnackbarClose = () => {
    setSuccessSnackbarOpen(false); // ปิด Snackbar
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {/* Snackbar สำหรับข้อความสำเร็จ */}
      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSuccessSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // กำหนดตำแหน่งตรงกลางด้านบน
      >
        <Alert 
          onClose={handleSuccessSnackbarClose} 
          severity="success" // กำหนดสีพื้นหลังเป็นสีเขียว
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      <div className={"bb"}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "100vh",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                backgroundImage: 'url("https://st.depositphotos.com/2235295/2688/i/450/depositphotos_26885089-stock-photo-coffee-cup-with-jute-bag.jpg")',
                backgroundSize: "1205px",
                width: "150vh",
                height: "97.7vh",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
          </Box>
          <div className={"my"}>
            <Box 
              className={"whitebox"} 
              sx={{
                padding: "25px",
                borderRadius: "17px",
                width: "125%",
                border: "1px solid #734622",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.7)",
                backgroundColor: "#F2F2F0",
                margin: "28px",
                position: "relative",
                overflow: "hidden",
                animation: "glow 1.5s infinite alternate",
              }}
            >
              <Box className={"itemkbox"}>
                <Box
                  className={"title"}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h4" mb={1} sx={{ fontFamily: "Pacifico, cursive", fontSize: "40px", color: "#6a4f4b" }}>
                    Welcome To Coffee
                  </Typography>
                  <Typography variant="h5" mb={1} sx={{ fontFamily: "Pacifico, cursive", fontSize: "34px", color: "#6a4f4b" }}>
                    Login
                  </Typography>

                  <form onSubmit={handleLogin}>
                    <TextField
                      label="Username"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    {error && (
                      <Typography
                        variant="body2"
                        sx={{ color: "red", textAlign: "center", mt: 1 }}
                      >
                        {error}
                      </Typography>
                    )}

                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        marginTop: 2,
                        backgroundColor: bgColor,
                        color: textColor,
                        fontFamily: "'cursive'",
                        fontSize: "15px",
                        borderRadius: "20px",
                        '&:hover': {
                          backgroundColor: '#643D1D',
                        },
                      }}
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "กำลังโหลด..." : "Login"}
                    </Button>
                  </form>

                </Box>
              </Box>
            </Box>
          </div>
        </Box>
      </div>
    </>
  )
}

export default Login