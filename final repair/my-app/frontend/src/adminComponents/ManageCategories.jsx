import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo1.png";
import Topbar from "./Topbar";

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Filter categories based on search query
    if (searchQuery.trim() === "") {
      setFilteredCategories(categories);
    } else {
      setFilteredCategories(
        categories.filter((category) =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, categories]);

  const fetchCategories = () => {
    axios
      .get("http://localhost:5000/api/categories")
      .then((response) => {
        setCategories(response.data);
        setFilteredCategories(response.data); // Set filtered categories on initial load
      })
      .catch((error) => console.error("Error fetching categories:", error));
  };

  const validateCategoryName = (name) => {
    const regex = /^[A-Za-z\s]+$/; // Only alphabetic characters and spaces
    return regex.test(name);
  };

  const handleAddOrUpdateCategory = () => {
    if (!newCategory.trim()) {
      setError("Category name is required");
      return;
    }
    if (!validateCategoryName(newCategory)) {
      setError("Category name must contain only letters and spaces");
      return;
    }
    setError(""); // Clear the error before submitting
  
    if (editMode) {
      axios
        .put(`http://localhost:5000/api/categories/${editCategoryId}`, { name: newCategory })
        .then(() => {
          fetchCategories();  // Update the list after edit
          setShowModal(false);
          setNewCategory("");
          setEditMode(false);
          setSuccessMessage("Category updated successfully!");
          setTimeout(() => setSuccessMessage(""), 3000); // Hide success message after 3 seconds
        })
        .catch((error) => {
          console.error("Error updating category:", error);
          if (error.response && error.response.data.error) {
            setError(error.response.data.error); // Display the error message from backend
          } else {
            setError("Error updating category, please try again!");
          }
        });
    } else {
      axios
        .post("http://localhost:5000/api/categories", { name: newCategory })
        .then((response) => {
          setCategories([...categories, response.data]);
          setNewCategory("");
          setShowModal(false);
          setSuccessMessage("Category added successfully!");
          setTimeout(() => setSuccessMessage(""), 3000); // Hide success message after 3 seconds
        })
        .catch((error) => {
          console.error("Error adding category:", error);
          if (error.response && error.response.data.error) {
            setError(error.response.data.error); // Display the error message from backend
          } else {
            setError("Error adding category, please try again!");
          }
        });
    }
  };
  
  

  const deleteCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      axios
        .delete(`http://localhost:5000/api/categories/${id}`)
        .then(() => {
          setCategories(categories.filter((category) => category._id !== id));
          setFilteredCategories(filteredCategories.filter((category) => category._id !== id));
          setSuccessMessage("Category deleted successfully!");
        })
        .catch((error) => console.error("Error deleting category:", error));
    }
  };

  const handleEdit = (category) => {
    setNewCategory(category.name);
    setEditMode(true);
    setEditCategoryId(category._id);
    setShowModal(true);
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
          <li className="menu-item">
            <NavLink to="/CreateServices" className="text-decoration-none text-white">
              Manage Services
            </NavLink>
          </li>
          <li className="menu-item">
                      <NavLink to="/manage-reports" className="text-decoration-none text-white">
                      Manage Reports
                   </NavLink>
                    </li>
          <li className="menu-item active">
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

        <div className="category-management mt-4">
          <div className="d-flex justify-content-center align-items-center">
            <h2
              className="service-title"
              style={{ color: "#0a3d62", fontSize: "24px", fontWeight: "bold" }}
            >
              Manage Categories
            </h2>
          </div>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          <div className="d-flex justify-content-end">
            <button
              className="btn btn-warning text-white"
              onClick={() => {
                setShowModal(true);
                setEditMode(false);
                setNewCategory("");
              }}
            >
              Add Category
            </button>
          </div>

          <div className="table-container mt-3">
            <table className="table table-hover custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category, index) => (
                  <tr key={category._id}>
                    <td>{index + 1}</td>
                    <td>{category.name}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleEdit(category)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-sm text-white"
                        style={{ backgroundColor: "#0a3d62" }}
                        onClick={() => deleteCategory(category._id)}
                      >
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
          <Modal.Title>{editMode ? "Edit Category" : "Add Category"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
  <Form.Group className="mb-3">
    <Form.Label>Category Name</Form.Label>
    <Form.Control
      type="text"
      value={newCategory}
      onChange={(e) => setNewCategory(e.target.value)}
      placeholder="Enter category name"
    />
    {error && <small className="text-danger">{error}</small>} {/* Display error message */}
  </Form.Group>
</Form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddOrUpdateCategory}>
            {editMode ? "Update Category" : "Add Category"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ManageCategories;
