import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutuserMutation } from '../utils/authAPI';
import { useGetUserCartQuery } from '../utils/cartAPI';
import { useGetUserWishlistQuery } from '../utils/wishlistAPI';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { data: cartdata } = useGetUserCartQuery();
  const { data: wishlistdata } = useGetUserWishlistQuery();

  const cart = cartdata?.data?.items || [];
  const wishlist = wishlistdata?.data?.products || [];

  const [Logoutuser] = useLogoutuserMutation();
  const user = useSelector((state) => state.authSlice.user);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCategory = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.category-dropdown')) {
        setIsCategoryOpen(false);
      }
      if (!event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await Logoutuser().unwrap();
      navigate("/signin");
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsProfileOpen(false);
    }
  };

  const onHandleChange = (e) => {
    setQuery(e.target.value);
  }

  const onSearchClick = () => {
    navigate(`/search/${query}`);
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex-shrink-0 flex items-center">
            <Link to={"/"}>
              <img
                src="/src/assets/images/flogo.png"
                alt="logo"
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to={"/"}
                className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Home
              </Link>
              <Link
                to={"/about"}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                About Us
              </Link>
              <Link
                to={"/contact"}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Contact Us
              </Link>
              <Link
                to={"/shop"}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Shop
              </Link>

              <div className="relative category-dropdown">
                <button
                  onClick={toggleCategory}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center"
                >
                  Category
                  <svg
                    className={`ml-1 h-4 w-4 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isCategoryOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link
                      to={"/category/men"}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-300"
                      onClick={() => setIsCategoryOpen(false)}
                    >
                      Men
                    </Link>
                    <Link
                      to={"/category/women"}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-300"
                      onClick={() => setIsCategoryOpen(false)}
                    >
                      Women
                    </Link>
                    <Link
                      to={"/category/kids"}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-300"
                      onClick={() => setIsCategoryOpen(false)}
                    >
                      Kids
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  onChange={onHandleChange}
                  className="w-64 pl-3 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={onSearchClick}
                >
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">

              {
                user && user.role === "customer" ? (
                  <>
                    <button
                      className="relative p-2 text-gray-700 hover:text-blue-600 transition duration-300 rounded-full hover:bg-gray-100"
                      onClick={() => navigate("/wishlist")}
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {wishlist.length}
                      </span>
                    </button>

                    <button
                      className="relative p-2 text-gray-700 hover:text-blue-600 transition duration-300 rounded-full hover:bg-gray-100"
                      onClick={() => navigate("/cart")}
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cart.length}
                      </span>
                    </button>
                  </>
                ) : (
                  null
                )
              }

              {user ? (

                <div className="relative profile-dropdown">
                  <button
                    onClick={toggleProfile}
                    className="p-2 text-gray-700 hover:text-blue-600 transition duration-300 rounded-full hover:bg-gray-100 flex items-center"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                        <p className="font-medium">Hello, {user.firstname || user.email}</p>
                      </div>
                      {
                        user.role === "admin" ? (
                          <>
                            <Link
                              to={"/admin/dashboard"}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-300"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              Admin Dashboard
                            </Link>
                            <Link
                              to={"/admin/products"}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-300"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              Products
                            </Link>
                            <Link
                              to={"/admin/orders"}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-300"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              Orders
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              to={"/profile"}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-300"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              My Profile
                            </Link>
                            <Link
                              to={"/myorders"}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-300"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              Orders
                            </Link>
                            <Link
                              to={"/wishlist"}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-300"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              Wishlist
                            </Link>
                          </>
                        )
                      }

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition duration-300"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (

                <div className="flex items-center space-x-3">
                  <Link
                    to={"/signin"}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to={"/signup"}
                    className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition duration-300"
              >
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <Link
              to={"/"}
              className="text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to={"/about"}
              className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to={"/contact"}
              className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
            <Link
              to={"/shop"}
              className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>

            <div className="px-3 py-2">
              <button
                onClick={toggleCategory}
                className="text-gray-700 hover:text-blue-600 text-base font-medium flex items-center w-full text-left"
              >
                Category
                <svg
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isCategoryOpen && (
                <div className="mt-2 ml-4 space-y-2">
                  <Link
                    to={"/category/men"}
                    className="block py-2 text-sm text-gray-700 hover:text-blue-600 transition duration-300"
                    onClick={() => {
                      setIsCategoryOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    Men
                  </Link>
                  <Link
                    to={"/category/women"}
                    className="block py-2 text-sm text-gray-700 hover:text-blue-600 transition duration-300"
                    onClick={() => {
                      setIsCategoryOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    Women
                  </Link>
                  <Link
                    to={"/category/kids"}
                    className="block py-2 text-sm text-gray-700 hover:text-blue-600 transition duration-300"
                    onClick={() => {
                      setIsCategoryOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    Kids
                  </Link>
                </div>
              )}
            </div>

            {!user && (
              <div className="px-3 py-2 border-t border-gray-200 pt-4">
                <div className="space-y-2">
                  <Link
                    to={"/signin"}
                    className="block w-full text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to={"/signup"}
                    className="block w-full text-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}

            {user && (
              <div className="px-3 py-2 flex space-x-4 border-t border-gray-200 pt-4">
                <button
                  className="relative p-2 text-gray-700 hover:text-blue-600 transition duration-300"
                  onClick={() => {
                    navigate("/wishlist");
                    setIsMenuOpen(false);
                  }}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </button>

                <button
                  className="relative p-2 text-gray-700 hover:text-blue-600 transition duration-300"
                  onClick={() => {
                    navigate("/cart");
                    setIsMenuOpen(false);
                  }}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    5
                  </span>
                </button>

                <button
                  className="p-2 text-gray-700 hover:text-blue-600 transition duration-300"
                  onClick={() => {
                    navigate("/profile");
                    setIsMenuOpen(false);
                  }}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>
              </div>
            )}

            <div className="px-3 py-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  onChange={onHandleChange}
                  className="w-full pl-3 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={onSearchClick}
                >
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div >
    </nav >
  );
};

export default Header;