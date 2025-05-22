import React, {useState, useRef, useEffect} from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
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
import {createTheme, ThemeProvider} from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import CropIcon from "@mui/icons-material/Crop";
import line from "./assets/Line 1 (1).png";
import maharaktadan from "./assets/Group 5.png";
import Group4 from "./assets/Group 4.png";
import blood from "./assets/image-removebg-preview (6) 1.png";
import Group3 from "./assets/Group 3.png";
import men from "./assets/image-removebg-preview (5) 1.png";
import Group2 from "./assets/Group 2.png";
import Group1 from "./assets/Group 1.png";
import vector1 from "./assets/Vector 1.png";
import vector2 from "./assets/Vector 2.png";
import jbs from "./assets/184b69cb-d0b1-43d1-a6da-ae37766e2c4f 1.png";
import axios from "axios";


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

    const [src, setSrc] = useState(null);
    const [crop, setCrop] = useState({
        unit: "%",
        width: 100,
        aspect: 1 / 1.414,
    });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [cropDialogOpen, setCropDialogOpen] = useState(false);
    const imageRef = useRef(null);
    const previewCanvasRef = useRef(null);

    const posterRef = useRef(null);

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

    const getCroppedImg = () => {
        if (!previewCanvasRef.current) {
            return;
        }

        const canvas = previewCanvasRef.current;
        const croppedImageUrl = canvas.toDataURL("image/jpeg");
        setUploadedImage(croppedImageUrl);
        setCropDialogOpen(false);
    };

    const handleCancelCrop = () => {
        setCropDialogOpen(false);
        setSrc(null);
    };

    const downloadPoster = async () => {
        if (!posterRef.current) return;

        try {
            setLoading(true);

            const blob = await (await fetch(uploadedImage)).blob();

            const formData = new FormData();
            formData.append("name", name);
            formData.append("contact", contact);
            formData.append("profilePic", blob, "profile.png");

            await axios.post(
                "https://blood-donation-be-2rnu.onrender.com/api/donors",
                formData
            );

            const canvas = await html2canvas(posterRef.current, {
                scale: 2,
                useCORS: true,
            });

            const imgData = canvas.toDataURL("image/png");

            const link = document.createElement("a");
            link.href = imgData;
            link.download = `${name || "poster"}.png`;
            link.click();

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
        setNotification({...notification, open: false});
    };

    return (


        <Box
            className="mt-4"
            sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Box sx={{mb: 4, mt: 5}}>
                <Typography
                    variant="h4"
                    component="h1"
                    align="center"
                    gutterBottom
                    sx={{fontWeight: "bold"}}
                >
                    Blood Donation Camp Poster Generator
                </Typography>
                <Typography
                    variant="body1"
                    align="center"
                    color="text.secondary"
                    sx={{fontWeight: "bold"}}
                >
                    Upload your photo, enter your details, and download your
                    personalized blood donation poster
                </Typography>
            </Box>

            <Box sx={{gap: 4, flexWrap: "wrap"}}>
                <Paper elevation={3} sx={{p: 3, mb: 4}}>
                    <Typography variant="h6" gutterBottom>
                        Enter Your Details
                    </Typography>
                    <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
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
                            startIcon={<CloudUploadIcon/>}
                            sx={{mt: 1}}
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
                            <Box sx={{textAlign: "center", mt: 2}}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{mb: 1}}
                                >
                                    Preview of cropped image:
                                </Typography>
                                <img
                                    src={uploadedImage}
                                    alt="Cropped preview"
                                    style={{
                                        width: "100px",
                                        height: "141px",
                                        objectFit: "cover",
                                        border: "2px solid #1565c0",
                                    }}
                                />
                            </Box>
                        )}

                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<DownloadIcon/>}
                            onClick={downloadPoster}
                            sx={{mt: 2}}
                            disabled={!uploadedImage || !name || !contact}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit"/>
                            ) : (
                                "Generate & Download Poster"
                            )}
                        </Button>
                    </Box>
                </Paper>

                <Paper
                    elevation={3}
                    sx={{p: 2, mb: 2}}
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
                        {/*<Box*/}
                        {/*/>*/}
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
                                શ્રી ગામ ખાખરીયા પ્રગતી મંડળ, સુરત
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
                                સ્નેહમિલન સમારોહ
                            </Box>
                            <Box sx={{width: "210px"}} component="img" src={line}/>
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
                                sx={{width: "230px"}}
                            />
                        </Box>
                    </Box>

                    <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                        <Box sx={{position: "relative"}}>
                            <Box
                                component="img"
                                src={Group4}
                                sx={{width: "100%", padding: "30px 0"}}
                            />
                            <Box
                                component="img"
                                src={blood}
                                sx={{
                                    position: "absolute",
                                    top: "90px",
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
                                <Box sx={{pr: 2}}>રક્તદાન સર્વ શ્રેઠ મહાદાન</Box>
                                <Box sx={{padding: "6px", pr: 3}}>ચાલો કરીયે રક્તદાન</Box>
                                <Box sx={{padding: "4px", paddingLeft: {sm: "40px", xs: '10px'}}}>
                                    મળશે કોઈને જીવનદાન
                                </Box>
                            </Box>
                        </Box>

                        {/*<Box*/}
                        {/*    sx={{*/}
                        {/*        position: "relative",*/}
                        {/*        width: "240px",*/}
                        {/*        height: "240px",*/}
                        {/*        backgroundImage: `url(${Group3})`,*/}
                        {/*        backgroundSize: "contain",*/}
                        {/*        backgroundRepeat: "no-repeat",*/}
                        {/*        borderRadius: 2,*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    {uploadedImage && (*/}
                        {/*        <Box*/}
                        {/*            component="img"*/}
                        {/*            src={uploadedImage}*/}
                        {/*            alt="User Photo"*/}
                        {/*            sx={{*/}
                        {/*                position: "absolute",*/}
                        {/*                top: "5px",*/}
                        {/*                left: "16px",*/}
                        {/*                width: "158px",*/}
                        {/*                borderRadius: "18px",*/}
                        {/*                height: "185px",*/}
                        {/*                objectFit: "cover",*/}
                        {/*            }}*/}
                        {/*        />*/}
                        {/*    )}*/}

                        {/*    <Box*/}
                        {/*        sx={{*/}
                        {/*            position: "absolute",*/}
                        {/*            bottom: "29px",*/}
                        {/*            left: {xs:"37%" , sm:'30%'},*/}
                        {/*            color: "#fff",*/}
                        {/*            fontWeight: "bold",*/}
                        {/*            fontSize: "15px",*/}
                        {/*            textAlign: "center",*/}
                        {/*            whiteSpace: "nowrap",*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        {name}*/}
                        {/*    </Box>*/}
                        {/*</Box>*/}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {/* Tablet Device */}
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: {sm: '220px', xs: '180px'},
                                    height: {sm: '250px', xs: '200px'},
                                    backgroundColor: '#e0e0e0',
                                    borderRadius: 6,
                                    padding: {sm: 1.5, xs: 1},
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                                    border: '2px solid #d0d0d0'
                                }}
                            >
                                {/* Screen */}
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: '#000000',
                                        borderRadius: 4,
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <img src={uploadedImage} style={{ width: '100%' , height: '100%' , objectFit: 'fill' }} />
                                </Box>

                                {/* Home Button */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: -8,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: 16,
                                        height: 16,
                                        backgroundColor: '#bdbdbd',
                                        borderRadius: '50%',
                                        border: '1px solid #999'
                                    }}
                                />
                            </Box>

                            {/* Red Stand */}
                            <Box
                                sx={{
                                    width: {sm: 200, xs: 180},
                                    height: 40,
                                    backgroundColor: '#e53935',
                                    borderRadius: '20px 20px 8px 8px',
                                    marginTop: -2,
                                    boxShadow: '0 4px 12px rgba(229, 57, 53, 0.3)',
                                    position: 'relative',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: 'white',
                                    fontSize: {xs:'14px' , sm: '16px'},
                                    letterSpacing: '1px',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: -8,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: 60,
                                        height: 16,
                                        backgroundColor: '#e53935',
                                        borderRadius: '8px 8px 0 0'
                                    }
                                }}
                            >
                                {name}
                            </Box>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 3
                        }}
                    >
                        <Box sx={{width: "50%", height: "200px"}}>
                            <Box component="img" src={men} sx={{height: '100%', objectFit: "contain"}}/>
                        </Box>
                        <Box
                            sx={{
                                fontSize: "13px",
                                width: '50%',
                                paddingLeft: "10px",
                                fontWeight: "bold",
                            }}
                        >
                            <Box sx={{color: "red"}}>-: બ્લડ ડોનેશનના ફાયદા :-</Box>
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
                        <Box>
                            <Box sx={{position: "absolute", top: "27px", left: "-17px"}}>
                                <Box
                                    component="img"
                                    src={vector1}
                                    sx={{height: "220px", width: "250px"}}
                                />
                            </Box>

                            <Box sx={{position: "absolute", top: "25px", left: "-48px"}}>
                                <Box
                                    component="img"
                                    src={vector2}
                                    sx={{width: "245px", transform: "rotate(-5deg)"}}
                                />
                            </Box>

                            <Box sx={{position: "absolute", top: "70px", left: "0px"}}>
                                <Box
                                    component="img"
                                    src={jbs}
                                    sx={{height: "40px", width: "40px"}}
                                />
                                <Box sx={{display: "flex", gap: "10px"}}>
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
                                    <Box sx={{fontSize: "21px"}}>
                                        <Box sx={{color: "white"}}>MAY</Box>
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
                                    <Box>સ્થળ: કુંજ ફાર્મ, આનંદધારા ની પાછળ,<br/>
                                        મોટા વરાછા,સુરત.</Box>
                                </Box>
                            </Box>
                        </Box>

                        <Box>
                            <Box>
                                <Box
                                    component="img"
                                    src={Group2}
                                    sx={{
                                        position: "absolute",
                                        right: "10px",
                                        top: "-10px",
                                        height: "80px",
                                        width: "200px",
                                    }}
                                />
                            </Box>

                            <Box sx={{position: "absolute", top: "80px", right: "-5px"}}>
                                <Box
                                    sx={{
                                        color: "rgba(25, 3, 126, 1)",
                                        fontSize: "10px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    રક્તદાન કરવા માટે ટ્રસ્ટ ના વૉટ્સએપ્પ ઉપર <br/> અથવા ફોને ઉપર
                                    નામ નોંધણી કરાવશો.
                                </Box>
                            </Box>
                            <Box sx={{position: "absolute", top: "120px", right: "0px"}}>
                                <Box
                                    component="img"
                                    src={Group1}
                                    sx={{height: "40px", width: "170px"}}
                                />
                            </Box>
                            <Box sx={{
                                fontSize: "12px",
                                display: "flex",
                                justifyContent: "center",
                                color: "rgba(25, 3, 126, 1)",
                                position: 'absolute',
                                top: "160px",
                                right: "0px",
                                fontWeight: "bold",
                            }}>
                                રમેશભાઈ એમ. પલડિયા
                            </Box>
                        </Box>

                    </Box>
                </Paper>
            </Box>

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
                                aspect={1 / 1.414}
                            >
                                <img
                                    ref={imageRef}
                                    alt="Crop me"
                                    src={src}
                                    style={{maxHeight: "70vh", maxWidth: "100%"}}
                                />
                            </ReactCrop>
                        )}

                        <div style={{display: "none"}}>
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
                        startIcon={<CropIcon/>}
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
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.severity}
                    sx={{width: "100%"}}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
