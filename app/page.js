"use client";
import { AppBar, Toolbar, IconButton, Typography, Stack, Box, Modal, Button, TextField, Paper } from "@mui/material";
import { firestore } from "./firebase"; // Correct import
import { collection, getDocs, query, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HomeIcon from '@mui/icons-material/Home';

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [recipeOpen, setRecipeOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newItem, setNewItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLandingPage, setIsLandingPage] = useState(true);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleRecipeOpen = () => setRecipeOpen(true);
  const handleRecipeClose = () => setRecipeOpen(false);
  const handleStart = () => setIsLandingPage(false);

  const handleAddItem = async () => {
    if (newItem.trim()) {
      await addDoc(collection(firestore, "pantry"), { name: newItem, quantity });
      setNewItem("");
      setQuantity(1);
      handleClose();
      updatePantry();
    }
  };

  const handleRemoveItem = async (id) => {
    const docRef = doc(firestore, "pantry", id);
    await deleteDoc(docRef);
    updatePantry();
  };

  const handleUpdateQuantity = async (id, newQuantity) => {
    const docRef = doc(firestore, "pantry", id);
    await updateDoc(docRef, { quantity: newQuantity });
    updatePantry();
  };

  const updatePantry = async () => {
    const q = query(collection(firestore, "pantry"));
    const snapshot = await getDocs(q);
    const pantryList = [];
    snapshot.forEach((doc) => {
      pantryList.push({ id: doc.id, ...doc.data() });
    });
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const filteredPantry = pantry.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    borderRadius: 2,
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{
        background: isLandingPage 
          ? 'linear-gradient(to right, #6a11cb, #2575fc)' 
          : 'linear-gradient(to right, #e0eafc, #cfdef3)',
        p: 2,
        animation: 'fadeIn 2s ease-in-out'
      }}
    >
      {isLandingPage ? (
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          bgcolor={"rgba(0, 0, 0, 0.7)"}
          p={4}
          borderRadius={2}
          boxShadow={3}
          sx={{
            animation: 'fadeIn 2s ease-in-out'
          }}
        >
          <Typography variant="h3" fontWeight="bold" color={"#fff"} mb={2} sx={{ fontFamily: 'Brush Script MT, cursive' }}>
            Welcome to Pantry Tracker
          </Typography>
          <Typography variant="h6" color={"#ddd"} mb={4} sx={{ fontFamily: 'Arial, sans-serif' }}>
            Keep track of your pantry items effortlessly.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleStart} 
            sx={{ 
              px: 4, 
              py: 1.5, 
              bgcolor: '#fff', 
              color: '#3f51b5', 
              '&:hover': {
                bgcolor: '#e0e0e0',
              }
            }}
          >
            Get Started
          </Button>
        </Box>
      ) : (
        <Box width="100%">
          <AppBar position="static" sx={{ bgcolor: '#3f51b5' }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setIsLandingPage(true)}>
                <HomeIcon />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Pantry Tracker
              </Typography>
            </Toolbar>
          </AppBar>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="calc(100vh - 64px)" // Adjust height to account for AppBar
            width="100%"
            p={3}
            sx={{
              background: 'linear-gradient(to right, #e0eafc, #cfdef3)'
            }}
          >
            <Paper elevation={3} sx={{ width: "90%", maxWidth: "900px", p: 3, bgcolor: 'rgba(255, 255, 255, 0.95)', borderRadius: 2 }}>
              <Box
                width="100%"
                bgcolor={"#3f51b5"}
                color={"#fff"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                p={2}
                borderRadius={1}
                mb={3}
              >
                <Typography variant="h4" fontWeight="bold" sx={{ fontFamily: 'Arial, sans-serif' }}>
                  Pantry Items
                </Typography>
              </Box>
              {pantry.length > 0 && (
                <TextField
                  label="Search Pantry"
                  variant="outlined"
                  value={searchTerm}
                  onChange={handleSearch}
                  fullWidth
                  sx={{ marginY: 2, bgcolor: 'white' }}
                />
              )}
              <Stack spacing={2} sx={{ maxHeight: "400px", overflowY: "auto", mt: 2 }}>
                {filteredPantry.map((item) => (
                  <Box
                    key={item.id}
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    p={2}
                    bgcolor={"#f0f0f0"}
                    borderRadius={1}
                  >
                    <Typography variant={"h6"} fontWeight="bold" sx={{ fontFamily: 'Arial, sans-serif' }}>
                      {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                    </Typography>
                    <Box display={"flex"} alignItems={"center"} gap={2}>
                      <IconButton onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                        <RemoveIcon />
                      </IconButton>
                      <Typography variant={"h6"}>{item.quantity}</Typography>
                      <IconButton onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                        <AddIcon />
                      </IconButton>
                      <Button variant="contained" color="secondary" onClick={() => handleRemoveItem(item.id)}>
                        Remove
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Stack>
              <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
                <Button variant="contained" onClick={handleOpen}>
                  Add Item
                </Button>
                <Button variant="contained" color="primary" onClick={handleRecipeOpen} startIcon={<MenuBookIcon />}>
                  Recipe Suggestions
                </Button>
              </Stack>
            </Paper>
          </Box>
        </Box>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add New Item
          </Typography>
          <TextField
            label="Item Name"
            variant="outlined"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            fullWidth
          />
          <TextField
            label="Quantity"
            type="number"
            variant="outlined"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            fullWidth
          />
          <Button variant="contained" onClick={handleAddItem}>
            Add
          </Button>
        </Box>
      </Modal>
      <Modal
        open={recipeOpen}
        onClose={handleRecipeClose}
       
        aria-labelledby="recipe-modal-title"
        aria-describedby="recipe-modal-description"
      >
        <Box sx={style}>
          <Typography id="recipe-modal-title" variant="h6" component="h2">
            Recipe Suggestions
          </Typography>
          <Typography id="recipe-modal-description" sx={{ mt: 2 }}>
            Here are some recipe suggestions based on your pantry items:
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {/* This is where you can map through an array of recipes and display them */}
            {filteredPantry.map((item) => (
              <Typography key={item.id}>
                {/* Dummy recipe suggestion */}
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)} Soup
              </Typography>
            ))}
          </Stack>
          <Button variant="contained" onClick={handleRecipeClose} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}