import * as React from 'react';
import TextField from '@mui/material/TextField';
import {Controller} from 'react-hook-form'

export default function MyTextField(props) {
  const {label, name, control} = props
  return (

      <TextField 
        id="outlined-basic" 
        label={label}
        variant="outlined" 
        className={"myForm"}
        InputLabelProps={{
          sx: {
            fontFamily: "cursive",
            fontSize: "15px",
            color: "#6a4f4b",
          },
        }}
      />
  );
}
