const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Data file path
const DATA_FILE = path.join(__dirname, 'MOCK_DATA.json');

// Helper function to read data
async function readData() {
  const data = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

// Helper function to write data
async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// REST API Routes

// Root route
app.get('/', (req, res) => {
  res.send("Welcome to our site.");
});

// Get all users
app.get(['/users', '/api/users'], async (req, res) => {
  try {
    const usersdata = await readData();
    res.json(usersdata);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// Get a single user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const usersdata = await readData();
    const user = usersdata.find((user) => user.id === id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// Add a new user
app.post('/api/users', async (req, res) => {
  try {
    const usersdata = await readData();
    const newUser = { ...req.body, id: usersdata.length + 1 };
    usersdata.push(newUser);
    await writeData(usersdata);
    res.status(201).json({ status: 'Success', id: newUser.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to write data' });
  }
});

// Update a user
app.put('/api/users/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const usersdata = await readData();
    const index = usersdata.findIndex((user) => user.id === id);

    if (index !== -1) {
      usersdata[index] = { ...usersdata[index], ...req.body, id };
      await writeData(usersdata);
      res.json({ status: 'Success', user: usersdata[index] });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update data' });
  }
});

// Delete a user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    let usersdata = await readData();
    const initialLength = usersdata.length;
    usersdata = usersdata.filter((user) => user.id !== id);

    if (usersdata.length < initialLength) {
      await writeData(usersdata);
      res.json({ status: 'Success', message: 'User deleted' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete data' });
  }
});

app.listen(port, () => {
  console.log(`Server connected at port: ${port}`);
});