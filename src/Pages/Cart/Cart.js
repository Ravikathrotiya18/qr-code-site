/* eslint-disable no-unused-vars */
import * as React from 'react';
import { Card, InputAdornment, Paper, TextField } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { FaPlus, FaMinus } from "react-icons/fa6";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useNavigate } from 'react-router-dom';
import { TiDocumentText } from "react-icons/ti";
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CssBaseline from '@mui/material/CssBaseline';
import './css/Cart.css';
import { useDispatch, useSelector } from 'react-redux';
import { removeItem, selectCartItems, updateQuantity } from '../../app/features/Cart/CartSlice';

function Cart() {
    const [activeTab, setActiveTab] = React.useState('Dine In');
    const [value, setValue] = React.useState('cart');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 'cart') {
            navigate('/cart');
        } else if (newValue === 'favorites') {
            navigate('/favorites');
        } else if (newValue === 'archive') {
            navigate('/archive');
        }
    };
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    const totalPrice = cartItems.reduce((total, item) => total + (item.quantity * item.itemDetails.itemPrice), 0);
    
    const handleIncrement = (item) => {
        dispatch(updateQuantity({ itemIndex: item.itemIndex, quantity: item.quantity + 1 }));
    };

    const handleDecrement = (item) => {
        if (item.quantity > 1) {
            dispatch(updateQuantity({ itemIndex: item.itemIndex, quantity: item.quantity - 1 }));
        } else {
            dispatch(removeItem({ itemIndex: item.itemIndex }));
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const carousel = document.querySelector('.carousel-inner');
        const cardWidth = document.querySelector('.card').offsetWidth;
        let currentPosition = 0;

        nextBtn.addEventListener('click', function () {
            currentPosition -= cardWidth;
            currentPosition = Math.max(currentPosition, -carousel.scrollWidth + carousel.offsetWidth);
            carousel.style.transform = `translateX(${currentPosition}px)`;
        });

        prevBtn.addEventListener('click', function () {
            currentPosition += cardWidth;
            currentPosition = Math.min(currentPosition, 0);
            carousel.style.transform = `translateX(${currentPosition}px)`;
        });
    });

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className='bg-gray-200 w-full'>
            <CssBaseline />
            <AppBar component="nav" className='w-full'>
                <div className="py-2 flex justify-around w-full bg-white text-black items-center">
                    <div className="flex w-full  items-center">
                        <div className="back_icon cursor-pointer"><ArrowBackOutlinedIcon onClick={() => { navigate(-1) }} /></div>
                        <div className="ml-2 text-lg font-medium">Cart</div>
                    </div>
                    <div className=" w-full flex ml-2 items-center rounded-md">
                        <div
                            onClick={() => setActiveTab('Dine In')}
                            className="cursor-pointer w-1/2 text-center">
                            <p className={`w-full ${activeTab === 'Dine In' ? ' bg-red-700 text-white' : 'text-black bg-gray-100'} py-2 rounded-lg`}>
                                Dine In
                            </p>
                        </div>
                        <div
                            onClick={() => setActiveTab('Pick Up')}
                            className="cursor-pointer w-1/2 text-center">
                            <p className={`w-full ${activeTab === 'Pick Up' ? ' bg-red-700 text-white' : 'text-black bg-gray-100'} py-2 rounded-lg`}>
                                Pick Up
                            </p>
                        </div>
                    </div>
                </div>
            </AppBar>
            <div className="flex-grow my-4 w-full py-14 flex justify-around gap-4 flex-wrap overflow-auto">
                <div className='w-full bg-white  text-center py-2 '>
                    {cartItems.map((item, index) => (
                        <div key={index} className="flex  p-2 w-full justify-between">
                            <div className="itemDetails text-start">
                                <div className="itemName font-semibold text-base">{item.itemDetails.itemName}</div>
                                <div className="preparation text-gray-700">Preparation: {item.itemDetails.itemDescription}</div>
                                <div className="itemPrice flex items-center font-semibold text-lg">
                                    <div><CurrencyRupeeIcon className='rupeesIcon' /></div>
                                    <p className='mt-1'>{item.itemDetails.itemPrice}</p>
                                </div>
                                <div className="text-gray-700 text-xs flex items-center">Customize <ArrowDropDownIcon /></div>
                            </div>
                            <div className="itemQuantity">
                                <div className="flex items-center border-red-800 border rounded-lg shadow-md">
                                    <div className="minus w-full text-center text-md p-1 px-3" onClick={() => handleDecrement(item)}>
                                        <FaMinus />
                                    </div>
                                    <div className="quantity w-full text-center text-white text-md p-1 bg-red-700 e-full px-3">
                                        {item.quantity}
                                    </div>
                                    <div className="plus w-full text-center text-md p-1 px-3" onClick={() => handleIncrement(item)}>
                                        <FaPlus />
                                    </div>
                                </div>
                                <div className="itemQuantityWisePrice mt-2 flex justify-end items-center font-semibold text-lg">
                                    <div><CurrencyRupeeIcon className='rupeesIcon' /></div>
                                    <p className='mt-1'>{item.itemDetails.itemPrice * item.quantity}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="border-t-2 bg-white w-full mt-2">
                        <TextField
                            id="standard-start-adornment"
                            sx={{ m: 1, width: '25ch' }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><TiDocumentText /></InputAdornment>,
                            }}
                            placeholder='Any Special Cooking Request?'
                            variant="standard"
                            className='commentInput'
                        />
                    </div>
                    <div className="bg-white p-3 my-4">
                        <div className='text-start'><p>You Many also like to add:</p></div>
                        <div className="carousel my-2">
                            <div className="carousel-inner">
                                <div className="card">
                                    <Card variant="outlined" className='suggestionCard card col-span-6 shadow-sm rounded-md p-2 h-28 text-center '>
                                        <div className="grid h-full content-between justify-items-start">
                                            <div className="content col-span-12">Mineral Water <br /> (1 Ltr) </div>
                                            <div className="itemPrice flex items-center font-semibold text-lg">
                                                <div><CurrencyRupeeIcon className='rupeesIcon' /></div>
                                                <p className='mt-1'>20</p>
                                            </div>
                                        </div>
                                    </Card>
                                    <Card variant="outlined" className='suggestionCard card col-span-6 shadow-sm rounded-md p-2 h-28 text-center '>
                                        <div className="grid h-full content-between justify-items-start">
                                            <div className="content col-span-12">Mineral Water <br /> (1 Ltr) </div>
                                            <div className="itemPrice flex items-center font-semibold text-lg">
                                                <div><CurrencyRupeeIcon className='rupeesIcon' /></div>
                                                <p className='mt-1'>20</p>
                                            </div>
                                        </div>
                                    </Card>
                                    <Card variant="outlined" className='suggestionCard card col-span-6 shadow-sm rounded-md p-2 h-28 text-center '>
                                        <div className="grid h-full content-between justify-items-start">
                                            <div className="content col-span-12">Mineral Water <br /> (1 Ltr) </div>
                                            <div className="itemPrice flex items-center font-semibold text-lg">
                                                <div><CurrencyRupeeIcon className='rupeesIcon' /></div>
                                                <p className='mt-1'>20</p>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-3 my-4">
                        <div className="text-start font-bold">Bill Details:</div>
                        <div className="flex my-2 justify-between">
                            <div>Total Items</div>
                            <div>Rs. {totalPrice}</div>
                        </div>
                        <div className="text-start font-bold">Cancellation Policy</div>
                        <p className='text-start'>As a general rule Buyer shall not be entitled to cancel Order once placed. Buyer may choose to cancel Order only within one-minute of the Order being placed. However, subject to Buyer's previous cancellation history, Swiggy reserves the right to deny any refund to Buyer pursuant to a cancellation initiated by Buyer even if the same is within one-minute followed by suspension of account, as may be necessary in the sole discretion of Swiggy.</p>
                    </div>
                </div>
            </div>
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={handleChange}
                >
                    <BottomNavigationAction value="cart" label="Cart" icon={<ShoppingCartOutlinedIcon />} />
                    <BottomNavigationAction value="favorites" label="Favorites" icon={<FavoriteIcon />} />
                    <BottomNavigationAction value="archive" label="Archive" icon={<ArchiveIcon />} />
                </BottomNavigation>
            </Paper>
        </Box>
    );
}

export default Cart;
