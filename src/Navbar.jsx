import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Button,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { useState } from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navItems = [
    {
      label: "Blood Donation Poster",
      path: "/",
      icon: <PostAddIcon color="black" />,
    },
      {
      label: "Donor List",
      path: "/donorList",
      icon: <FormatListBulletedIcon color="#000" />,
    },

  ];
  return (
    <>
    <Container maxWidth={"md"}>
      <AppBar
        color="primary"
        position="static"
        sx={{ mb: 0, borderRadius: "30px" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="bold">
            Blood Donation
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                color="black"
                component={Link}
                to={item.path}
                sx={{ textTransform: "none", fontWeight: 500 }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setOpen(true)}
            sx={{ display: { xs: "flex", sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="top"
        open={open}
        onClose={() => setOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            height: "100vh",
            background: "linear-gradient(135deg, #F8F9FA, #E0F7FA)",
            px: 3,
            py: 3,
            boxShadow: 6,
            position: "relative",
          },
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={() => setOpen(false)}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            backgroundColor: "#FFFFFF",
            boxShadow: 2,
            "&:hover": {
              backgroundColor: "#CDCDCD",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        <List sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map((item) => (
            <ListItem
              key={item.label}
              component={Link}
              to={item.path}
              onClick={() => setOpen(false)}
              sx={{
                backgroundColor: "#FFFFFF",
                borderRadius: 2,
                boxShadow: 3,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#BFE0F8",
                  transform: "scale(1.03)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  color:"black"
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
      </Container>
    </>
  );
};
export default Navbar;
