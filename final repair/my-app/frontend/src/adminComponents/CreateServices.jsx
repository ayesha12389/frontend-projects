import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo1.png";
import Topbar from "./Topbar";

function CreateServices() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    category: "",
    description: "",
    image: "",
  });
  const [categories, setCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [editMode, setEditMode] = useState(false); // Track if it's in edit mode
  const [currentServiceId, setCurrentServiceId] = useState(null); // To store the ID of the service being edited

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, categoriesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/services"),
          axios.get("http://localhost:5000/api/categories"),
        ]);
        setServices(servicesRes.data);
        setCategories(categoriesRes.data);
        setFilteredServices(servicesRes.data); // Initialize filtered list
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(
        (service) =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  }, [searchQuery, services]);

  const handleAddOrUpdateService = async () => {
    const errors = {};
  
    // Service name must be alphabetic
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!newService.name) errors.name = "Service name is required";
    else if (!nameRegex.test(newService.name)) errors.name = "Service name must be alphabetic";
  
    if (!newService.category) errors.category = "Category is required";
    if (!newService.description) errors.description = "Description is required";
  
    // Image is required only when adding a new service
    if (!editMode && !newService.image) {
      errors.image = "Service image is required";
    }
  
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("name", newService.name);
      formData.append("category", newService.category);
      formData.append("description", newService.description);
      if (newService.image) {
        formData.append("image", newService.image);
      }
  
      let response;
      if (editMode) {
        response = await axios.put(
          `http://localhost:5000/api/services/${currentServiceId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setServices(
          services.map((service) =>
            service._id === currentServiceId ? response.data : service
          )
        );
        setSuccessMessage("Service updated successfully!");
      } else {
        response = await axios.post("http://localhost:5000/api/services", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setServices([...services, response.data]);
        setSuccessMessage("Service added successfully!");
      }
  
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
  
      setShowModal(false);
      setNewService({ name: "", category: "", description: "", image: "" });
      setEditMode(false);
      setCurrentServiceId(null);
      setErrorMessage("");
      setValidationErrors({});
    } catch (error) {
      console.error("Error saving service:", error.response ? error.response.data : error.message);
      setErrorMessage("Error saving service, please check console!");
    }
  };
  

  const handleEditService = (service) => {
    setNewService({
      name: service.name,
      category: service.category,
      description: service.description,
      image: "",
    });
    setCurrentServiceId(service._id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDeleteService = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(`http://localhost:5000/api/services/${id}`);
        setServices(services.filter((service) => service._id !== id));
        setFilteredServices(filteredServices.filter((service) => service._id !== id));
        setSuccessMessage("Service deleted successfully!");
      } catch (error) {
        console.error("Error deleting service:", error);
        setErrorMessage("Error deleting service, please check console!");
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar2">
        <div className="logo-container text-center">
          <img src={logo} alt="Smart Electric Workshop" className="sidebar-logo" />
          <h3 className="sidebar-title">Smart Electric Workshop</h3>
        </div>
        <ul className="sidebar-menu list-unstyled">
          <li className="menu-item">
            <NavLink to="/admin" className="text-decoration-none text-white">
              Dashboard
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/customers" className="text-decoration-none text-white">
              Manage Customers
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/technicians" className="text-decoration-none text-white">
              Manage Technicians
            </NavLink>
          </li>
          <li className="menu-item active">
            <NavLink to="/services" className="text-decoration-none text-white">
              Manage Services
            </NavLink>
          </li>
          <li className="menu-item">
                      <NavLink to="/manage-reports" className="text-decoration-none text-white">
                      Manage Reports
                   </NavLink>
                    </li>
          <li className="menu-item">
            <NavLink to="/categories" className="text-decoration-none text-white">
              Manage Categories
            </NavLink>
          </li>
          <li className="menu-item">
           <NavLink to="/manage-messages" className="text-decoration-none text-white">
            Manage Messages
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="main-content">
        <Topbar setSearchQuery={setSearchQuery} />

        <div className="service-management mt-4">
          <div className="d-flex justify-content-center align-items-center">
            <h2
              className="service-title"
              style={{ color: "#0a3d62", fontSize: "24px", fontWeight: "bold" }}
            >
              Manage Services
            </h2>
          </div>

          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          <div className="d-flex justify-content-end mt-2">
            <button
              className="btn btn-warning text-white"
              onClick={() => {
                setShowModal(true);
                setEditMode(false);
                setNewService({ name: "", category: "", description: "", image: "" });
              }}
            >
              Add Service
            </button>
          </div>

          <div className="table-container mt-3">
            <table className="table table-hover custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Service Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service, index) => (
                  <tr key={service._id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={service.image.startsWith("http") ? service.image : `http://localhost:5000${service.image}`}
                        alt="Service"
                        style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
                      />
                    </td>
                    <td>{service.name}</td>
                    <td>{service.category}</td>
                    <td>{service.description}</td>
                    <td>
                      <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditService(service)}>
                        Update
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteService(service._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Update Service" : "Add Service"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Service Name</Form.Label>
              <Form.Control
                type="text"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                isInvalid={!!validationErrors.name}
              />
              <Form.Control.Feedback type="invalid">{validationErrors.name}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={newService.category}
                onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                isInvalid={!!validationErrors.category}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{validationErrors.category}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                isInvalid={!!validationErrors.description}
              />
              <Form.Control.Feedback type="invalid">{validationErrors.description}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Service Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setNewService({ ...newService, image: e.target.files[0] })}
                isInvalid={!!validationErrors.image}
              />
              <Form.Control.Feedback type="invalid">{validationErrors.image}</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddOrUpdateService}>
            {editMode ? "Update Service" : "Add Service"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CreateServices;
