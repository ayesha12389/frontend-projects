import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import * as geocoderLib from "leaflet-control-geocoder";
import axios from "axios";

// Attach geocoder if not present
if (!L.Control.Geocoder) {
  L.Control.Geocoder = geocoderLib;
}

// Fix for default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const AdminProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    imageUrl: "https://via.placeholder.com/120",
    role: "",
    expertise: "",
  });

  const [location, setLocation] = useState(null);
  const [phoneError, setPhoneError] = useState("");
  const [imageError, setImageError] = useState("");
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setProfile(data);
      if (data.location) {
        setLocation({ lat: data.location.lat, lng: data.location.lng });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const validatePhoneNumber = (phone) => {
    const pattern = /^((\+92|0)\d{10})$/;
    return pattern.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && !validatePhoneNumber(value)) {
      setPhoneError("Phone number must be in format +92XXXXXXXXXX or 03XXXXXXXXX.");
    } else {
      setPhoneError("");
    }
    setProfile({ ...profile, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedFormats = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "image/avif"];
    if (!allowedFormats.includes(file.type)) {
      setImageError("Invalid format. Allowed formats: JPEG, PNG, GIF, WebP, SVG, AVIF.");
      return;
    }

    setImageError("");
    const reader = new FileReader();
    reader.onloadend = () => setProfile((prev) => ({ ...prev, imageUrl: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
  
    if (!userId || !token) {
      alert("User not authenticated!");
      navigate("/login");
      return;
    }
  
    if (!location) {
      alert("Please select a location on the map.");
      return;
    }
  
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/users/profile/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone: profile.phone,
          address: profile.address,
          imageUrl: profile.imageUrl,
          expertise: profile.role === "technician" ? profile.expertise : "",
          location: {
            type: "Point",
            coordinates: [location.lng, location.lat]
          }
        }),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");
  
      alert("Profile updated successfully!");
      setProfile(data.user);
      localStorage.setItem("profile", JSON.stringify(data.user));
    } catch (error) {
      if (error.message.includes("Phone number already exists")) {
        setPhoneError("Phone number already exists. Try another.");
      } else {
        console.error("Error updating profile:", error);
        alert("An error occurred while updating profile.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        setLocation(e.latlng);
        reverseGeocode(e.latlng);
      },
    });

    return location === null ? null : <Marker position={location} />;
  };

  const reverseGeocode = async (latlng) => {
    const { lat, lng } = latlng;
    setAddressLoading(true);
    console.log("Reverse geocoding using OpenCage:", lat, lng);

    try {
      const res = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
        params: {
          key: "29644d07c3694129bb50133592f4f4d5", // 🔁 Replace with your actual API key
          q: `${lat},${lng}`,
          pretty: 1,
          no_annotations: 1,
        },
      });

      const results = res.data.results;
      if (results && results.length > 0) {
        const address = results[0].formatted;
        console.log("OpenCage Address:", address);

        setProfile((prevProfile) => ({
          ...prevProfile,
          address: address,
        }));
      } else {
        console.warn("No address found.");
      }
    } catch (error) {
      console.error("OpenCage reverse geocoding failed:", error);
    } finally {
      setAddressLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light flex-column">
      <div className="w-100 p-4 shadow-lg bg-white rounded mt-2" style={{ maxWidth: "800px" }}>
        <div className="row g-0">
          <div className="col-md-4 text-center p-4 bg-light border-end rounded-start">
            <img src={profile.imageUrl} alt="Profile" className="rounded-circle img-fluid border shadow-sm" style={{ width: "120px", height: "120px" }} />
            <h5 className="mt-3 fw-bold">{profile.name}</h5>
            <p className="small">Your Admin Profile</p>
          </div>
          <div className="col-md-8 p-4">
            <h4 className="border-bottom pb-2 mb-3 fw-bold">(Must Complete Your Profile)</h4>
            <div className="mb-3">
              <strong>Full Name</strong>
              <input type="text" className="form-control bg-light" value={profile.name} disabled />
            </div>
            <div className="mb-3">
              <strong>Email</strong>
              <input type="text" className="form-control bg-light" value={profile.email} disabled />
            </div>
            {profile.role === "technician" && (
              <div className="mb-3">
                <strong>Expertise</strong>
                <input type="text" name="expertise" value={profile.expertise || ""} onChange={handleChange} className="form-control border-primary" />
              </div>
            )}
            <div className="mb-3">
              <strong>Phone No</strong>
              <input type="text" name="phone" value={profile.phone} onChange={handleChange} className="form-control border-primary" />
              {phoneError && <small className="text-danger">{phoneError}</small>}
            </div>

            <div className="mb-3">
              <strong>Select Location (Click on map)</strong>
              <MapContainer center={[31.5204, 74.3587]} zoom={13} style={{ height: "300px", width: "100%" }} className="mb-2 rounded shadow-sm">
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
              </MapContainer>
              {location && (
  <>
  <div className="mb-3">
  <strong>Selected Geo Location</strong>
  <input
    type="text"
    className="form-control bg-light"
    value={`${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`}
    readOnly
  />
</div>


    
  </>
)}

            </div>
            <div className="mb-3">
              <strong>Your Address</strong>
              <input type="text" name="address" value={profile.address} onChange={handleChange} className="form-control border-primary" />
            </div>
            <div className="mb-3">
              <strong>Profile Picture</strong>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="form-control border-primary" />
              {imageError && <small className="text-danger">{imageError}</small>}
            </div>
            <button onClick={handleSave} disabled={loading} className="btn btn-primary w-100 mt-3">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;