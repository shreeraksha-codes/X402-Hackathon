import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Demo from "./pages/Demo";
import Verify from "./pages/Verify";
import Products from "./pages/Products";
import NewProduct from "./pages/NewProduct";
import PassportDetail from "./pages/PassportDetail";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Landing />
            </>
          }
        />
        <Route
          path="/demo"
          element={
            <>
              <Navbar />
              <Demo />
            </>
          }
        />
        <Route
          path="/verify/:productId"
          element={
            <>
              <Navbar />
              <Verify />
            </>
          }
        />
        <Route
          path="/products"
          element={
            <>
              <Navbar />
              <Products />
            </>
          }
        />
        <Route
          path="/products/new"
          element={
            <>
              <Navbar />
              <NewProduct />
            </>
          }
        />
        <Route
          path="/products/:productId/passport"
          element={
            <>
              <Navbar />
              <PassportDetail />
            </>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
