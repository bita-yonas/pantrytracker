"use client";
import { AppBar, Toolbar, IconButton, Typography, Stack, Box, Modal, Button, TextField, Paper, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { firestore } from "./firebase"; // Correct import
import { collection, getDocs, query, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ListIcon from '@mui/icons-material/List';

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [recipeOpen, setRecipeOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newItem, setNewItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLandingPage, setIsLandingPage] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleRecipeOpen = () => setRecipeOpen(true);
  const handleRecipeClose = () => setRecipeOpen(false);
  const handleStart = () => setIsLandingPage(false);
  const toggleDrawer = (open) => () => setDrawerOpen(open);

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
    <Box width="100vw" height="100vh" display="flex" flexDirection="column">
      {isLandingPage ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          width="100%"
          sx={{
            backgroundImage: 'url("https://www.wallpapers.com/images/hd/abstract-black-and-white-minimalist-wallpaper-15806.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <Paper elevation={3} sx={{ p: 5, textAlign: 'center', bgcolor: 'rgba(255, 255, 255, 0.8)', borderRadius: 2 }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
              Welcome to Pantry Tracker
            </Typography>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Discover the ultimate way to manage your pantry.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleStart} 
              sx={{ 
                bgcolor: '#000', 
                '&:hover': {
                  bgcolor: '#333',
                }
              }}
            >
              Get Started
            </Button>
          </Paper>
        </Box>
      ) : (
        <>
          <AppBar position="static" sx={{ bgcolor: 'black' }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                <MenuBookIcon />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Pantry Tracker
              </Typography>
              <IconButton edge="end" color="inherit" aria-label="home" onClick={() => setIsLandingPage(true)}>
                <HomeIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              <List>
                <ListItem button onClick={handleOpen}>
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add Item" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <SearchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Search Items" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="View Items" />
                </ListItem>
              </List>
            </Box>
          </Drawer>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="calc(100vh - 64px)"
            width="100%"
            p={3}
            sx={{
              backgroundImage: 'url("https://www.wallpapers.com/images/hd/unique-minimalist-black-and-white-design-wallpaper-119108.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <Paper elevation={3} sx={{ width: "90%", maxWidth: "900px", p: 3, bgcolor: 'rgba(255, 255, 255, 0.95)', borderRadius: 2 }}>
              <Box
                width="100%"
                bgcolor="#000"
                color="#fff"
                display="flex"
                justifyContent="center"
                alignItems="center"
                p={2}
                borderRadius={1}
                mb={3}
              >
                <Typography variant="h4" fontWeight="bold" sx={{ fontFamily: 'Roboto, sans-serif' }}>
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
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p={2}
                    bgcolor="#f0f0f0"
                    borderRadius={1}
                  >
                    <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'Roboto, sans-serif' }}>
                      {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                      <IconButton onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                        <RemoveIcon />
                      </IconButton>
                      <Typography variant="h6">{item.quantity}</Typography>
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
              <Divider sx={{ my: 3 }} />
              <Stack direction="row" spacing={2} sx={{ marginTop: 2, justifyContent: 'center' }}>
                <Button variant="contained" color="primary" onClick={handleRecipeOpen} startIcon={<MenuBookIcon />}>
                  Recipe Suggestions
                </Button>
              </Stack>
            </Paper>
          </Box>
        </>
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
