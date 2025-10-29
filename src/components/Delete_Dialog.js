import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import CustomSnackbar from "./Snack_Bar";

const Delete_Dialog = ({ open, onClose, nurse }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/nurses/${nurse.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setSnackbar({
          open: true,
          message: `Deleted Nurse: ${nurse.name} (ID: ${nurse.id})`,
          severity: "success",
        });
        setTimeout(() => onClose(true), 1500);
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Failed to delete nurse",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "An error occurred while deleting",
        severity: "error",
      });
    }
  };

  if (!nurse) return null;

  return (
    <>
      <Dialog open={open} onClose={() => onClose(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <b>{nurse.name}</b> (ID: {nurse.id}
            )?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => onClose(false)}
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
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

export default Delete_Dialog;
