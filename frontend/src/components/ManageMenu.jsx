import { useState } from "react";
import {Box,TextField,Button,Table,TableBody,
  TableCell,TableContainer,TableHead,TableRow,
  Paper,IconButton,Typography,Select,
  MenuItem,InputLabel,FormControl,} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const ManageMenu = () => {
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Espresso", price: 50, category: "Coffee" },
    { id: 2, name: "Latte", price: 60, category: "Coffee" },
    { id: 3, name: "Green Tea", price: 70, category: "Tea" },
  ]);
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "" });
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const handleAddItem = () => {
    if (newItem.name && newItem.price && newItem.category) {
      setMenuItems([
        ...menuItems,
        { id: Date.now(), name: newItem.name, price: parseFloat(newItem.price), category: newItem.category },
      ]);
      setNewItem({ name: "", price: "", category: "" });
    }
  };

  const handleDeleteItem = (id) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setNewItem({ name: item.name, price: item.price, category: item.category });
  };

  const handleUpdateItem = () => {
    if (newItem.name && newItem.price && newItem.category) {
      setMenuItems(
        menuItems.map((item) =>
          item.id === editingItem.id
            ? { ...item, name: newItem.name, price: parseFloat(newItem.price), category: newItem.category }
            : item
        )
      );
      setEditingItem(null);
      setNewItem({ name: "", price: "", category: "" });
    }
  };

  const filteredItems = menuItems.filter(
    (item) =>
      (filterCategory === "All" || item.category === filterCategory) &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Manage Coffee Menu
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Search Name or SKU"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormControl fullWidth>
          <InputLabel>Filter Category</InputLabel>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Coffee">Coffee</MenuItem>
            <MenuItem value="Tea">Tea</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <TextField
          label="Menu Item"
          variant="outlined"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <TextField
          label="Price"
          variant="outlined"
          type="number"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
          >
            <MenuItem value="Coffee">Coffee</MenuItem>
            <MenuItem value="Tea">Tea</MenuItem>
          </Select>
        </FormControl>
        {editingItem ? (
          <Button variant="contained" color="primary" onClick={handleUpdateItem}>
            Update
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleAddItem}>
            Add
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Price (THB)</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleEditItem(item)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManageMenu