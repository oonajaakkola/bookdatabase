import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';

import './App.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBook from './AddBook';
import { Book } from '@mui/icons-material';


function App() {
  const [books, setBooks] = useState([]);

  const columnDefs = [
    { field: 'title', sortable: true, filter: true},
    { field: 'author', sortable: true, filter: true},
    { field: 'year', sortable: true, filter: true},
    { field: 'isbn', sortable: true, filter: true},
    { field: 'price', sortable: true, filter: true},
    { 
      headerName: '',
      field: 'id',
      width: 100,
      cellRenderer: params => 
      <IconButton onClick={() => deleteBook(params.value)} size="small" color="error">
        <DeleteIcon />
      </IconButton> 
    }
  ]

  useEffect(() => {
    fetchItems();
  }, [])

  const fetchItems = () => {
    fetch('https://todolist-9bab4-default-rtdb.europe-west1.firebasedatabase.app/items/.json')
    .then(response => response.json())
    .then(data => addKeys(data))
    .catch(err => console.error(err))
  }

 // Add keys into the todo objects
 const addKeys = (data) => {
  const keys = Object.keys(data);
  const valueKeys = Object.values(data).map((Book, index) => 
  Object.defineProperty(Book, 'id', {value: keys[index]}));
  setBooks(valueKeys);
}

  const addBook = (newBook) => {
    fetch('https://todolist-9bab4-default-rtdb.europe-west1.firebasedatabase.app/items/.json',
    {
      method: 'POST',
      body: JSON.stringify(newBook)
    })
    .then(response => fetchItems())
    .catch(err => console.error(err))
  }

  const deleteBook = (id) => {
    fetch(`https://todolist-9bab4-default-rtdb.europe-west1.firebasedatabase.app/items/${id}.json`,
    {
      method: 'DELETE',
    })
    .then(response => fetchItems())
    .catch(err => console.error(err))
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h3">
            Books
          </Typography>
        </Toolbar>
      </AppBar> 
      <AddBook addBook={addBook}/> 
      <div className="ag-theme-material" style={{ height: 400, width: 700 }}>
        <AgGridReact 
          rowData={books}
          columnDefs={columnDefs}
        />
      </div>
    </>
  );
}

export default App;