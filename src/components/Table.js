import React, { useEffect, useState } from "react";
import { Box, Button, Paper, TextField, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import * as XLSX from "xlsx";
import Add_Dialog from "./Add_Dialog";
import Delete_Dialog from "./Delete_Dialog";
import Edit_Dialog from "./Edit_Dialog";

const NurseTable = () => {
  const [nurses, setNurses] = useState([]);
  console.log("nurses:", nurses);

  const [search, setSearch] = useState("");
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const fetchNurses = () => {
    fetch("http://localhost:5000/api/nurses")
      .then((res) => res.json())
      .then((data) => setNurses(data))
      .catch((err) => console.error("Error fetching nurses:", err));
  };

  useEffect(() => {
    fetchNurses();
  }, []);

  const handleAddRow = () => {
    setAddDialogOpen(true);
  };

  const handleAddDialogClose = (added) => {
    setAddDialogOpen(false);
    if (added) fetchNurses();
  };

  const handleDeleteClick = (row) => {
    setSelectedNurse(row);
    setDeleteDialogOpen(true);
  };

  const handleDialogClose = (deleted) => {
    setDeleteDialogOpen(false);
    setSelectedNurse(null);
    if (deleted) fetchNurses();
  };

  const handleEdit = (row) => {
    setSelectedNurse(row);
    setEditDialogOpen(true);
  };

  const filteredRows = nurses.filter((nurse) => {
    const term = search.trim().toLowerCase();

    return (
      nurse.name?.toLowerCase().includes(term) ||
      nurse.license_number?.toString().toLowerCase().includes(term) ||
      nurse.dob?.toString().toLowerCase().includes(term)
    );
  });

  const handleDownloadCSV = () => {
    const ws = XLSX.utils.json_to_sheet(nurses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Nurses");
    XLSX.writeFile(wb, "nurses.csv");
  };

  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(nurses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Nurses");
    XLSX.writeFile(wb, "nurses.xlsx");
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      align: "center",
      headerAlign: "center",
    },
    { field: "name", headerName: "Name", flex: 1, minWidth: 120 },
    {
      field: "license_number",
      headerName: "License Number",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "dob",
      headerName: "Date of Birth",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "age",
      headerName: "Age",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            width: "100%",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => handleEdit(params.row)}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#115293" },
              minWidth: "auto",
              px: 1.5,
            }}
          >
            Edit
          </Button>

          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteClick(params.row)}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              backgroundColor: "#f44336",
              "&:hover": { backgroundColor: "#d32f2f" },
              minWidth: "auto",
              px: 1.5,
            }}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        pt: 5,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          width: "90%",
          p: 4,
          borderRadius: 3,
          backgroundColor: "white",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <TextField
            placeholder="Search Here"
            size="small"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: { xs: "100%", sm: "250px" } }}
          />
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              size="medium"
              startIcon={<AddIcon />}
              onClick={handleAddRow}
              sx={{
                backgroundColor: "#1976d2",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": { backgroundColor: "#115293" },
              }}
            >
              Add Row
            </Button>
            <Button
              variant="outlined"
              onClick={handleDownloadCSV}
              sx={{
                textTransform: "none",
                borderColor: "#ccc",
                color: "#333",
                "&:hover": { borderColor: "#999", backgroundColor: "#f5f5f5" },
              }}
            >
              Download CSV
            </Button>
            <Button
              variant="outlined"
              onClick={handleDownloadExcel}
              sx={{
                textTransform: "none",
                borderColor: "#ccc",
                color: "#333",
                "&:hover": { borderColor: "#999", backgroundColor: "#f5f5f5" },
              }}
            >
              Download Excel
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ height: 440 }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSizeOptions={[5, 10]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            disableRowSelectionOnClick
            sx={{
              borderRadius: 2,
              border: "1px solid #e5e7eb",
              "& .MuiDataGrid-cell": {
                py: 1,
                display: "flex",
                alignItems: "center",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
              },
              "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                outline: "none",
              },
            }}
          />
        </Box>
      </Paper>

      <Add_Dialog open={addDialogOpen} onClose={handleAddDialogClose} />

      <Delete_Dialog
        open={deleteDialogOpen}
        onClose={handleDialogClose}
        nurse={selectedNurse}
      />

      <Edit_Dialog
        open={editDialogOpen}
        onClose={(updated) => {
          setEditDialogOpen(false);
          setSelectedNurse(null);
          if (updated) fetchNurses();
        }}
        nurse={selectedNurse}
      />
    </Box>
  );
};

export default NurseTable;
