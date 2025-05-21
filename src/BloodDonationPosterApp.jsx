import React, { useState, useRef, useEffect } from "react";
import ReactCrop from "react-image-crop"; // Import ReactCrop
import "react-image-crop/dist/ReactCrop.css"; // Import crop styles
import html2canvas from "html2canvas";
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import CropIcon from "@mui/icons-material/Crop";
import logo from "./assets/logo.png";
import line from "./assets/Line 1 (1).png";
import maharaktadan from "./assets/Group 5.png";
import Group4 from "./assets/Group 4.png";
import blod from "./assets/image-removebg-preview (6) 1.png";
import Group3 from "./assets/Group 3.png";
import men from "./assets/image-removebg-preview (5) 1.png";
import Group2 from "./assets/Group 2 (1).png";
import Group1 from "./assets/Group 1.png";
import vector1 from "./assets/Vector 1.png";
import vector2 from "./assets/Vector 2.png";
import jbs from "./assets/184b69cb-d0b1-43d1-a6da-ae37766e2c4f 1.png";
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1565c0",
    },
    secondary: {
      main: "#f44336",
    },
  },
});

export default function BloodDonationPosterApp() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Cropping states
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({
    unit: "%",
    width: 100,
    aspect: 1 / 1.414,
  }); // A4 aspect ratio (width:height = 1:1.414)
  const [completedCrop, setCompletedCrop] = useState(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const imageRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const posterRef = useRef(null);

  // Load html2canvas library dynamically if needed
  useEffect(() => {
    if (typeof html2canvas === "undefined") {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  // Effect for drawing the preview canvas when crop changes
  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imageRef.current) {
      return;
    }

    const image = imageRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  }, [completedCrop]);

  // Handle file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSrc(reader.result);
        setCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate cropped image
  const getCroppedImg = () => {
    if (!previewCanvasRef.current) {
      return;
    }

    const canvas = previewCanvasRef.current;
    const croppedImageUrl = canvas.toDataURL("image/jpeg");
    setUploadedImage(croppedImageUrl);
    setCropDialogOpen(false);
  };

  // Cancel cropping
  const handleCancelCrop = () => {
    setCropDialogOpen(false);
    setSrc(null);
  };

  // Download the completed poster
  const downloadPoster = async () => {
    if (!posterRef.current) return;

    try {
      setLoading(true);

      // Convert base64 image to Blob
      const blob = await (await fetch(uploadedImage)).blob();

      // Prepare FormData payload
      const formData = new FormData();
      formData.append("name", name);
      formData.append("contact", contact);
      formData.append("profilePic", blob, "profile.png"); // key: profilePic, value: Blob, filename

      // Step 1: Post data using axios
      await axios.post(
        "https://blood-donation-be-2rnu.onrender.com/api/donors",
        formData
      );

      // Step 2: Convert DOM to canvas
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        useCORS: true,
      });

      // Step 3: Convert canvas to image data URL
      const imgData = canvas.toDataURL("image/png");

      // Step 4: Create a link and trigger download
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `${name || "poster"}.png`;
      link.click();

      // Notify user
      setNotification({
        open: true,
        severity: "success",
        message: "Poster saved and downloaded successfully!",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        severity: "error",
        message: "Failed to save or download poster.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
  
    <ThemeProvider theme={theme}>
      <Box
        className="mt-4"
        sx={{
          maxWidth: "700px",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          mx: "auto",
        }}
      >
        <Box sx={{ mb: 4,mt:5 }}>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold" }} // Bold title
          >
            Blood Donation Camp Poster Generator
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ fontWeight: "bold" }} // Bold subtitle (optional)
          >
            Upload your photo, enter your details, and download your
            personalized blood donation poster
          </Typography>
        </Box>

        <Box sx={{ gap: 4, flexWrap: "wrap" }}>
          <Paper elevation={3} sx={{ p: 3, mb: 4, flex: "1 1 300px" }}>
            <Typography variant="h6" gutterBottom>
              Enter Your Details
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                label="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Contact Number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{ mt: 1 }}
              >
                Upload Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>

              {uploadedImage && (
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Preview of cropped image:
                  </Typography>
                  <img
                    src={uploadedImage}
                    alt="Cropped preview"
                    style={{
                      width: "100px",
                      height: "141px", // A4 ratio: height = width * 1.414
                      objectFit: "cover",
                      border: "2px solid #1565c0",
                    }}
                  />
                </Box>
              )}

              <Button
                variant="contained"
                color="secondary"
                startIcon={<DownloadIcon />}
                onClick={downloadPoster}
                sx={{ mt: 2 }}
                disabled={!uploadedImage || !name || !contact}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Generate & Download Poster"
                )}
              </Button>
            </Box>
          </Paper>

          <Paper
            elevation={3}
            sx={{ p: 2, mb: 2 }}
            style={{ overflow: "hidden" }}
            ref={posterRef}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                height: "100%",
              }}
            >
              <Box
                component="img"
                src={logo}
                alt="Logo"
                sx={{ width: "50px", height: "50px" }}
              />
              <Box
                sx={{
                  padding: "20px",

                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    color: "rgba(2, 56, 98, 1)",
                    fontSize: "15px",
                    fontWeight: "bold",
                  }}
                >
                  સાથ તમારો જોઈએ છે ચૅરિટેબલ ટ્રસ્ટ પરિવાર
                </Box>
                <Box
                  sx={{
                    textAlign: "center",
                    fontSize: "15px",
                    paddingTop: "10px",
                    fontWeight: "bold",
                    color: "red",
                  }}
                >
                  {" "}
                  દ્વારા થેલેસેમયા પીડિત બાળકો માટે
                </Box>
                <Box sx={{ width: "210px" }} component="img" src={line} />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box>
                <Box
                  component="img"
                  src={maharaktadan}
                  sx={{ width: "230px" }}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex" }}>
              {/* Left side */}
              <Box sx={{ position: "relative" }}>
                <Box
                  component="img"
                  src={Group4}
                  sx={{ width: "200px", padding: "30px 0" }}
                />
                <Box
                  component="img"
                  src={blod}
                  sx={{
                    position: "absolute",
                    top: "99px",
                    right: "7px",
                    height: "40px",
                  }}
                />
                <Box
                  sx={{
                    textAlign: "center",
                    color: "blue",
                    fontSize: "15px",
                    fontWeight: "900",
                    paddingTop: "10px",
                  }}
                >
                  <Box sx={{ pr: 2 }}>રક્તદાન સર્વ શ્રેઠ મહાદાન</Box>
                  <Box sx={{ padding: "6px", pr: 3 }}>ચાલો કરીયે રક્તદાન</Box>
                  <Box sx={{ padding: "4px", paddingLeft: "40px" }}>
                    મળશે કોઈને જીવનદાન
                  </Box>
                </Box>
              </Box>

              {/* Right side with Group3 as background */}
              <Box
                sx={{
                  position: "relative",
                  width: "180px",
                  height: "180px",
                  backgroundImage: `url(${Group3})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 2,
                  pt: 8,

                  // Responsive alignment
                  ml: {
                    xs: "0", // pushes the box to the right on extra-small screens
                    sm: 14, // reset on small and larger screens
                  },
                }}
              >
                {/* User photo placement */}
                {uploadedImage && (
                  <Box
                    component="img"
                    src={uploadedImage}
                    alt="User Photo"
                    sx={{
                      position: "absolute",
                      top: "5px",
                      left: "11px",
                      width: "160px",
                      borderRadius: "18px",
                      height: "188px", // Width * 1.414 for A4 ratio
                      // border: "3px solid #fff",
                      objectFit: "cover",
                    }}
                  />
                )}

                {/* Name inside red base at bottom center */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "29px", // adjust as needed to sit well on red area
                    left: "50%",
                    transform: "translateX(-50%)",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "17px",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {name}
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    top: "210px",
                    left: "24px",
                    color: "#fff",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  <Box
                    variant="h6"
                    sx={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {contact}
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Box>
                <Box component="img" src={men} sx={{ height: "215px" }} />
              </Box>
              <Box
                sx={{
                  fontSize: "13px",

                  paddingLeft: "10px",
                  fontWeight: "bold",
                }}
              >
                <Box sx={{ color: "red" }}>-: બ્લડ ડોનેશનના ફાયદા :-</Box>
                <Box
                  sx={{
                    color: "rgba(30, 58, 153, 1)",
                    padding: "2px",
                    fontWeight: "800",
                  }}
                >
                  {" "}
                  ૧. હાર્ટએટેક ના રિસ્ક ને ઘટાડે{" "}
                </Box>
                <Box
                  sx={{
                    color: "rgba(30, 58, 153, 1)",
                    padding: "2px",
                    fontWeight: "800",
                  }}
                >
                  {" "}
                  ૨. કેન્સર નું રિસ્ક ઘટાડે
                </Box>
                <Box
                  sx={{
                    color: "rgba(30, 58, 153, 1)",
                    padding: "2px",
                    fontWeight: "800",
                  }}
                >
                  {" "}
                  ૩. અકાળે સ્ટોક ઘટાડે{" "}
                </Box>
                <Box
                  sx={{
                    color: "rgba(30, 58, 153, 1)",
                    padding: "2px",
                    fontWeight: "800",
                  }}
                >
                  {" "}
                  ૪. રોગપ્રતિકારક શક્તિ વધારે{" "}
                </Box>
                <Box
                  sx={{
                    color: "rgba(30, 58, 153, 1)",
                    padding: "2px",
                    fontWeight: "800",
                  }}
                >
                  {" "}
                  ૫. એક બોટલ રક્તદાન થી ત્રણ વ્યક્તિઓ ને નવું જીવ મળે
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                position: "relative",
                paddingBottom: "228px",
              }}
            >
              <Box sx={{ position: "absolute", top: "30px", left: "-40px" }}>
                <Box
                  component="img"
                  src={vector1}
                  sx={{ height: "220px", width: "300px" }}
                />
              </Box>

              <Box sx={{ position: "absolute", top: "40px", left: "-10px" }}>
                <Box
                  component="img"
                  src={vector2}
                  sx={{ width: "230px", transform: "rotate(-5deg)" }}
                />
              </Box>

              <Box sx={{ position: "absolute", top: "70px", left: "0px" }}>
                <Box
                  component="img"
                  src={jbs}
                  sx={{ height: "40px", width: "40px" }}
                />
                <Box sx={{ display: "flex", gap: "10px" }}>
                  <Box
                    sx={{
                      height: "30px",
                      width: "30px",
                      border: "2px solid white",
                      borderRadius: "8px",
                      backgroundColor: "rgba(3, 24, 71, 1)",
                      fontSize: "18px",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    25
                  </Box>
                  <Box sx={{ fontSize: "21px" }}>
                    <Box sx={{ color: "white" }}>MAY</Box>
                    <Box
                      sx={{
                        color: "yellow",
                        position: "absolute",
                        top: "70px",
                      }}
                    >
                      2025
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    color: "white",
                    fontSize: "12px",
                    fontWeight: "bold",
                    paddingTop: "3x0px",
                  }}
                >
                  <Box
                    sx={{
                      pt: 3,
                      pb: 1,
                    }}
                  >
                    સમય: સવારે ૨:૦૦ થી ૫:૩૦{" "}
                  </Box>
                  <Box>સ્થળ: લોક સમર્પણ કેન્દ્ર મિનીબજાર સુરત.</Box>
                </Box>
              </Box>

              <Box>
                <Box
                  component="img"
                  src={Group2}
                  sx={{
                    position: "absolute",
                    right: "10px",
                    top: "-10px",
                    height: "100px",
                    width: "250px",
                  }}
                />
              </Box>

              <Box sx={{ position: "absolute", top: "98px", right: "-183px" }}>
                <Box
                  sx={{
                    width: "390px",
                    color: "rgba(25, 3, 126, 1)",
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                >
                  રક્તદાન કરવા માટે ટ્રસ્ટ ના વૉટ્સએપ્પ ઉપર <br /> અથવા ફોને ઉપર
                  નામ નોંધણી કરાવશો.
                </Box>
              </Box>
              <Box sx={{ position: "absolute", top: "140px", right: "30px" }}>
                <Box
                  component="img"
                  src={Group1}
                  sx={{ height: "40px", width: "150px" }}
                />
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Image Cropping Dialog */}
        <Dialog
          open={cropDialogOpen}
          onClose={handleCancelCrop}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Crop Your Image (A4 Format)</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              {src && (
                <ReactCrop
                  src={src}
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1 / 1.414} // A4 aspect ratio
                >
                  <img
                    ref={imageRef}
                    alt="Crop me"
                    src={src}
                    style={{ maxHeight: "70vh", maxWidth: "100%" }}
                  />
                </ReactCrop>
              )}

              {/* Hidden canvas for preview */}
              <div style={{ display: "none" }}>
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    width: completedCrop?.width ?? 0,
                    height: completedCrop?.height ?? 0,
                  }}
                />
              </div>

              <Typography variant="body2" color="textSecondary">
                Drag to adjust the crop area. The image will be cropped to A4
                portrait format (1:1.414 ratio).
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelCrop} color="primary">
              Cancel
            </Button>
            <Button
              onClick={getCroppedImg}
              color="primary"
              variant="contained"
              startIcon={<CropIcon />}
              disabled={!completedCrop?.width || !completedCrop?.height}
            >
              Apply Crop
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
