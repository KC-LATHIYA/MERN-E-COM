import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useMyprofileQuery } from './utils/authAPI'
import { useSelector } from 'react-redux'
import Home from './pages/Home'
import Layout from './layout/Layout'
import ErrorPage from './components/ErrorPage'
import About from './pages/About'
import Contact from './pages/Contact'
import Shop from './pages/Shop'
import Cart from './pages/customer/Cart'
import WishList from './pages/customer/WishList.JSX'
import ProductDetailsPage from './pages/customer/ProductDetailsPage'
import Profile from './pages/customer/Profiile'
import MyOrders from './pages/customer/MyOrders'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import ProtectedRoutes from './components/ProtectedRoute'
import Category from './pages/customer/Category'
import Search from './pages/customer/Search'
import CheckOut from './pages/customer/CheckOut'
import PaymentStatusPage from './pages/customer/PaymentStatusPage'
import OrderConfirmationPage from './pages/customer/OrderConfirmationPage'
import OrderDetailsPage from './pages/customer/OrderDetailsPage'
import AdminCreateProduct from './pages/admin/AdminCreateProduct'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminEditProduct from './pages/admin/AdminEditProduct'
import AdminOrderDetails from './pages/admin/AdminOrderDetails'
import AdminOrders from './pages/admin/AdminOrders'
import AdminProducts from './pages/admin/AdminProducts'
import Review from './pages/customer/Review'

function App() {

  const user = useSelector((state) => state.authSlice.user);
  const { isLoading } = useMyprofileQuery();

  const router = createBrowserRouter([{
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [

      { index: true, element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/shop", element: <Shop /> },
      { path: "/product-details/:productId", element: <ProductDetailsPage /> },
      { path: "/category/:category", element: <Category /> },
      { path: "/search/:query", element: <Search /> },
      { path: "/signup", element: <Signup /> },
      { path: "/signin", element: <Signin /> },

      {
        path: "/admin/create-product",
        element: (
          <ProtectedRoutes role="admin" isLoading={isLoading} user={user}>
            <AdminCreateProduct />
          </ProtectedRoutes>
        )
      },

      {
        path: "/admin/dashboard",
        element:
          (
            <ProtectedRoutes role="admin" isLoading={isLoading} user={user}>
              <AdminDashboard />
            </ProtectedRoutes>
          )
      },

      {
        path: "/admin/edit-product/:productId",
        element: (
          <ProtectedRoutes role="admin" isLoading={isLoading} user={user}>
            <AdminEditProduct />
          </ProtectedRoutes>
        )
      },

      {
        path: "/admin/order-details/:orderId",
        element:
          (
            <ProtectedRoutes role="admin" isLoading={isLoading} user={user}>
              <AdminOrderDetails />
            </ProtectedRoutes>
          )
      },

      {
        path: "/admin/orders",
        element:
          (
            <ProtectedRoutes role="admin" isLoading={isLoading} user={user}>
              <AdminOrders />
            </ProtectedRoutes>
          )
      },

      {
        path: "/admin/products",
        element:
          (
            <ProtectedRoutes role="admin" isLoading={isLoading} user={user}>
              <AdminProducts />
            </ProtectedRoutes>
          )
      },

      {
        path: "/cart",
        element: (
          <ProtectedRoutes role="customer" isLoading={isLoading} user={user}>
            <Cart />
          </ProtectedRoutes>
        )
      },

      {
        path: "/wishlist",
        element: (
          <ProtectedRoutes role="customer" isLoading={isLoading} user={user}>
            <WishList />
          </ProtectedRoutes>
        )
      },

      {
        path: "/profile",
        element: (
          <ProtectedRoutes role="customer" isLoading={isLoading} user={user}>
            <Profile />
          </ProtectedRoutes>
        )
      },

      {
        path: "/myorders",
        element: (
          <ProtectedRoutes role="customer" isLoading={isLoading} user={user}>
            <MyOrders />
          </ProtectedRoutes>
        )
      },

      {
        path: "/order-details",
        element:
          (
            <ProtectedRoutes role="customer" isLoading={isLoading} user={user}>
              <OrderDetailsPage />
            </ProtectedRoutes>
          )
      },

      {
        path: "/order/confirmation",
        element:
          (
            <ProtectedRoutes role="customer" isLoading={isLoading} user={user}>
              <OrderConfirmationPage />
            </ProtectedRoutes>
          )
      },

      {
        path: "/payment",
        element:
          (
            <ProtectedRoutes role="customer" isLoading={isLoading} user={user}>
              <PaymentStatusPage />
            </ProtectedRoutes>
          )
      },

      {
        path: "/checkout",
        element:
          (
            <ProtectedRoutes role="customer" isLoading={isLoading} user={user}>
              <CheckOut />
            </ProtectedRoutes>
          )
      },

      {
        path: "/review/:productId",
        element:
          (
            <ProtectedRoutes role="customer" isLoading={isLoading} user={user}>
              <Review />
            </ProtectedRoutes>
          )
      },

    ]
  }])

  return (
    <RouterProvider router={router}>

    </RouterProvider>
  )
}

export default App
