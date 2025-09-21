'use client'
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItemText,
  IconButton,
  Card,
  CardContent,
  Stack,
  InputAdornment,
  CssBaseline,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/system";
import api from "../lib/api";

// Starry background container
const StarryBackground = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "black",
  overflow: "hidden",
  zIndex: -1,
});

const createStars = (count) => {
  let boxShadow = "";
  for (let i = 0; i < count; i++) {
    boxShadow += `${Math.random() * 2000}px ${Math.random() * 2000}px #FFF,`;
  }
  return boxShadow.slice(0, -1);
};

const StarLayer = styled("div")`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background: transparent;
  box-shadow: ${(props) => props.boxShadow};
  animation: animStar ${(props) => props.animationDuration}s linear infinite;

  &:after {
    content: ' ';
    position: absolute;
    top: -2000px;
    width: ${(props) => props.size}px;
    height: ${(props) => props.size}px;
    background: transparent;
    box-shadow: ${(props) => props.boxShadow};
  }
`;

const Stars = ({ size, animationDuration }) => {
  const [boxShadow, setBoxShadow] = useState("");

  useEffect(() => {
    setBoxShadow(createStars(700));
  }, []);

  return (
    <StarLayer
      size={size}
      animationDuration={animationDuration}
      boxShadow={boxShadow}
    />
  );
};

const StarrySky = () => (
  <>
    <Stars size={0.5} animationDuration={150} />
    <Stars size={1} animationDuration={100} />
    <Stars size={1.5} animationDuration={50} />
  </>
);

const GlobalStyles = `
  @keyframes animStar {
    from {
      transform: translateY(-2000px);
    }
    to {
      transform: translateY(0px);
    }
  }
`;

// Backend URL is now handled by the axios instance

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      await api.post('/tasks', { title });
      setTitle("");
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (id) => {
    if (!editingTitle) return;
    try {
      await api.put(`/tasks/${id}`, { title: editingTitle });
      setEditingTask(null);
      setEditingTitle("");
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const completeTask = async (id) => {
    try {
      await api.put(`/tasks/${id}/complete`);
      fetchTasks();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // MUI dark theme
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#0d1117",
        paper: "#161b22",
      },
      primary: { main: "#90caf9" },
      secondary: { main: "#f48fb1" },
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <style>{GlobalStyles}</style>
      <StarryBackground>
        <StarrySky />
      </StarryBackground>
      <Container maxWidth="sm" sx={{ py: 5, position: "relative" }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontFamily: "Georgia, serif",
            color: "#E0E0E0",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          Todo List
        </Typography>

        <form onSubmit={addTask} style={{ marginBottom: "24px" }}>
          <TextField
            fullWidth
            label="Enter a task"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{
              input: { color: "#fff" },
              label: { color: "#bbb" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#555" },
                "&:hover fieldset": { borderColor: "#90caf9" },
                "&.Mui-focused fieldset": { borderColor: "#90caf9" },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    type="submit"
                    variant="text"
                    sx={{ backgroundColor: "transparent", color: "#90caf9" }}
                  >
                    Add
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </form>

        <List>
          {tasks.map((task) => (
            <Card
              key={task.id}
              sx={{
                mb: 2,
                backgroundColor: task.completed ? "transparent" : "transparent",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {editingTask === task.id ? (
                  <TextField
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => updateTask(task.id)}
                    autoFocus
                    fullWidth
                    variant="standard"
                    sx={{
                      input: { color: "#fff", fontSize: "1.1rem" },
                    }}
                  />
                ) : (
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          textDecoration: task.completed
                            ? "line-through"
                            : "none",
                          color: task.completed ? "#888" : "#fff",
                          fontSize: "1.1rem",
                        }}
                      >
                        {task.title}
                      </Typography>
                    }
                  />
                )}

                <Stack direction="row" spacing={1}>
                  {!task.completed && (
                    <>
                      <IconButton
                        color="info"
                        onClick={() => {
                          setEditingTask(task.id);
                          setEditingTitle(task.title);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="success"
                        onClick={() => completeTask(task.id)}
                      >
                        <CheckIcon />
                      </IconButton>
                    </>
                  )}
                  <IconButton
                    color="error"
                    onClick={() => deleteTask(task.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </List>

        <Typography
          variant="body2"
          align="center"
          sx={{
            mt: 4,
            color: "#888",
            fontFamily: "monospace",
          }}
        >
          Created by shubham-jamui
        </Typography>
      </Container>
    </ThemeProvider>
  );
}
