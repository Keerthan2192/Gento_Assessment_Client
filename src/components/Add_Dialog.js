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

const Add_Dialog = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    license_number: "",
    dob: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!open) {
      setFormData({ name: "", license_number: "", dob: "" });
      setSnackbar({ open: false, message: "", severity: "success" });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const handleSubmit = async () => {
    const { name, license_number, dob } = formData;

    if (!name || !license_number || !dob) {
      setSnackbar({
        open: true,
        message: "All fields are required",
        severity: "warning",
      });
      return;
    }

    if (new Date(dob) > new Date()) {
      setSnackbar({
        open: true,
        message: "Date of Birth cannot be in the future",
        severity: "error",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/nurses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSnackbar({
          open: true,
          message: "Nurse added successfully!",
          severity: "success",
        });
        setTimeout(() => {
          setFormData({ name: "", license_number: "", dob: "" });
          onClose(true);
        }, 1500);
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Failed to add nurse",
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

  const handleCancel = () => {
    setFormData({ name: "", license_number: "", dob: "" });
    setSnackbar({ open: false, message: "", severity: "success" });
    onClose(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
        <DialogTitle>Add New Nurse</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="license_number"
              label="License Number"
              value={formData.license_number}
              onChange={handleChange}
              fullWidth
              required
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
              required
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
            Add
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

export default Add_Dialog;
