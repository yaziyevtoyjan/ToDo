import Login from "./components/Login";
import Register from "./components/Register";
import { Route,BrowserRouter as Router, Routes } from "react-router-dom";
import UserTasksPage from "./components/UserTasksPage/UserTasksPage"
import UserListsPage from "./components/UserListsPage/UserListsPage";

function App() {
  return (
    <div>
    <Router>
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/userTasks" element={<UserTasksPage/>}/>
      <Route path="/userLists" element={<UserListsPage/>} />
    </Routes>
    </Router>
    </div>
  );
}

export default App;
