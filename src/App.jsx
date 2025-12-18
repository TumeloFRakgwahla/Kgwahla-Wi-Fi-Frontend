// App.jsx - Main application component
// This is the root component that sets up routing and global components

import { RouterProvider } from 'react-router-dom';
import { router } from './utils/routes';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      {/* RouterProvider handles all the page navigation */}
      <RouterProvider router={router} />

      {/* Toaster shows notification messages like success/error alerts */}
      <Toaster />
    </>
  );
}

export default App;