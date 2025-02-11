import * as React from "react";
import { IconButton, OutlinedInput, InputLabel, InputAdornment, FormControl } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const MyPassField = ({ label, value, onChange, name, id }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const cuStyles = {
    fontFamily: "cursive",
    fontSize: "16px",
    color: "#6a4f4b",
  };

  return (
    <FormControl variant="outlined" fullWidth margin="normal">
      <InputLabel htmlFor={id} sx={cuStyles}>
        {label}
      </InputLabel>
      <OutlinedInput
        id={id}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        name={name}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={showPassword ? "hide the password" : "display the password"}
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
        sx={cuStyles}
      />
    </FormControl>
  );
};

export default MyPassField;
