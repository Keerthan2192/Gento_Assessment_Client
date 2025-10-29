import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import CustomSnackbar from "./Snack_Bar";

const Edit_Dialog = ({ open, onClose, nurse }) => {
  const [formData, setFormData] = useState({
    name: "",
    license_number: "",
    dob: "",
    age: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (nurse) {
      setFormData({
        name: nurse.name || "",
        license_number: nurse.license_number || "",
        dob: nurse.dob ? nurse.dob.split("T")[0] : "",
        age: nurse.age || "",
      });
    }
  }, [nurse]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dob") {
      const birthDate = new Date(value);
      const now = new Date();

      let age = now.getFullYear() - birthDate.getFullYear();
      const monthDiff = now.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && now.getDate() < birthDate.getDate())
      )
        age--;

      setFormData((prev) => ({ ...prev, [name]: value, age: age || "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const handleSubmit = async () => {
    if (!formData.name || !formData.license_number || !formData.dob) {
      setSnackbar({
        open: true,
        message: "All fields are required",
        severity: "warning",
      });
      return;
    }

    if (new Date(formData.dob) > new Date()) {
      setSnackbar({
        open: true,
        message: "Date of Birth cannot be in the future",
        severity: "error",
      });
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/nurses/${nurse.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSnackbar({
          open: true,
          message: "Nurse updated successfully",
          severity: "success",
        });
        setTimeout(() => onClose(true), 1500);
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Error updating nurse",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setSnackbar({
        open: true,
        message: "Something went wrong",
        severity: "error",
      });
    }
  };

  const handleCancel = () => onClose(false);

  return (
    <>
      <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
        <DialogTitle>Edit Nurse Details</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              name="license_number"
              label="License Number"
              value={formData.license_number}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              name="dob"
              label="Date of Birth"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: today }}
            />
            <TextField
              name="age"
              label="Age"
              type="number"
              value={formData.age}
              fullWidth
              disabled
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={handleCancel} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              textTransform: "none",
              "&:hover": { backgroundColor: "#115293" },
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </>
  );
};

export default Edit_Dialog;
