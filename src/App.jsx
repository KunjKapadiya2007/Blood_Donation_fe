import { Route, Routes } from "react-router-dom";
import BloodDonationPoster from "./BloodDonationPosterApp";
import DonarList from "./DonarList";
import Navbar from "./Navbar";


function App() {

  return (
    <>
      <Navbar/>
            <Routes>
                <Route path="/" element={ <BloodDonationPoster />} />
                <Route path="/donorList" element={<DonarList />} />
            </Routes>
     
    </>
  )
}

export default App
