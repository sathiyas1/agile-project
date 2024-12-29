import logo from './logo.svg';
import './App.css';
import Login from './Components/Login';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Gang from './Components/Gang';
import ApiProvider from './Components/ApiProvider';

const router = createBrowserRouter([
  {
    path: '/gang',
    element: <Gang/>
  },
  {
    path: '/',
    element: <Login/>
  }
])
function App() {


  return (
   <>
    <ApiProvider>
     <RouterProvider router={router}/>
     </ApiProvider>
   </>
  );
}

export default App;
