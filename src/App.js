import { Toaster } from 'react-hot-toast';
import './App.css';
import EmployeesDetail from './Components/EmployeesDetail';
import Header from './Components/Header';

function App() {
  return (
    <div className="App">
      <Header />
      <EmployeesDetail/>
      <Toaster/>
    </div>
  );
}

export default App;
//Header(distance between logo and nav links, logo size, nav link font size, nav link hover color, nav link active color)
//Main Content(table to display employees details with columns for ID, Name, Email, and Actions, buttons for Add, Edit, Delete)
//Section (display when we highlight employee employee row)
//sidebar when click on Add button, a form to add employee details with fields for Name and Email, a submit button to save the details)
//Footer