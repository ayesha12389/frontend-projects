import React from "react";
import "./Upload.css"; // ✅ We'll move CSS into a separate file for clarity

const Upload = () => {
  return (
    <div className="upload-body">
      <div className="container">
        <h1>Upload Skin Image</h1>
        <form
          action="http://localhost:5001/process"
          method="post"
          encType="multipart/form-data"
        >
          <div className="form-group">
            <label htmlFor="image">Select Image</label>
            <input type="file" id="image" name="image" accept="image/*" required />
          </div>

          <div className="form-group">
            <label htmlFor="age">Approx Age</label>
            <input
              type="number"
              id="age"
              name="age_approx"
              placeholder="Enter Age"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="sex">Gender</label>
            <select id="sex" name="sex" required>
              <option value="" disabled defaultValue>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <button type="submit">Upload & Analyze</button>
        </form>
        <p className="note">
          * Supported formats: PNG, JPEG. High-quality images recommended.
        </p>
      </div>
    </div>
  );
};

export default Upload;
