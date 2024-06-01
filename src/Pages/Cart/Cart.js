/* eslint-disable no-unused-vars */
import * as React from 'react';
import { Badge, Card, InputAdornment, Paper, TextField } from '@mui/material';
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
import HomeIcon from '@mui/icons-material/Home';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CssBaseline from '@mui/material/CssBaseline';
import './css/Cart.css';
import { useDispatch, useSelector } from 'react-redux';
import { removeItem, selectCartItems, updateQuantity } from '../../app/features/Cart/CartSlice';
function Cart() {
    const [activeTab, setActiveTab] = React.useState('Dine In');
    const [value, setValue] = React.useState('cart');
    const [color, setColor] = React.useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 'cart') {
            navigate('/cart');
            setColor(true)
        } else if (newValue === 'home') {
            navigate('/');
        } else if (newValue === 'archive') {
            navigate('/archive');
        }
    };
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cartItems.reduce((total, item) => total + (item.quantity * item.variantDetails.price), 0);
    const handleIncrement = (item) => {
        if (item.quantity < 11) {
            dispatch(updateQuantity({ itemName: item.itemName, quantity: item.quantity + 1, variantDetails: item.variantDetails }));
        }
        else {
            alert('Max Limit Reached')
        }
    };
    const handleDecrement = (item) => {
        if (item.quantity > 1) {
            console.log(item)
            dispatch(updateQuantity({ itemName: item.itemName, quantity: item.quantity - 1, variantDetails: item.variantDetails }));
        } else {
            dispatch(removeItem({ itemName: item.itemName, variantDetails: item.variantDetails }));
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
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className='bg-gray-200 w-full'>
            <CssBaseline />
            <AppBar component="nav" className='w-full'>
                <div className="flex  justify-around w-full bg-white text-black items-center">
                    <div className="flex w-full  items-center">
                        <div className="back_icon cursor-pointer"><ArrowBackOutlinedIcon onClick={() => { navigate(-1) }} /></div>
                        <div className="ml-2 text-lg font-medium">Cart</div>
                    </div>
                    <div className=" w-full mr-2 items-center gap-1  bg-gray-200  rounded-md">
                        <div className="p-2 w-full bg-white">
                            <div className="tab-container">
                                <div
                                    className={`tab ${activeTab === 'Dine In' ? 'active' : ''} text-black  fontSize`}
                                    onClick={() => handleTabClick('Dine In')}
                                >
                                    DINE IN
                                </div>
                                <div
                                    className={`tab ${activeTab === 'Pick Up' ? 'active' : ''} text-black fontSize`}
                                    onClick={() => handleTabClick('Pick Up')}
                                >
                                    PICK UP
                                </div>
                                <div className="indicator" style={{ transform: activeTab === 'Dine In' ? 'translateX(0)' : 'translateX(100%)' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </AppBar>
            {cartItems.length > 0 ? (
                <div className="flex-grow my-4 w-full py-14 flex justify-around gap-4 flex-wrap overflow-auto">
                    <div className='w-full bg-white  text-center py-2 '>
                        {cartItems.map((item, index) => (
                            <div key={index} className="flex  p-2 w-full gap-14 justify-between">
                                <div className="itemDetails text-start w-4/6">
                                    <div className="itemName font-semibold text-base font-sm">{item.itemDetails.itemName}</div>
                                    <div className="preparation text-gray-700">Preparation: {item.variantDetails.unit}</div>
                                    <div className="itemPrice flex items-center font-semibold text-lg">
                                        <div><CurrencyRupeeIcon className='rupeesIcon' /></div>
                                        <p className='mt-1'>{item?.variantDetails.price}</p>
                                    </div>
                                    <div className="text-gray-700 text-xs flex items-center">Customize <ArrowDropDownIcon /></div>
                                </div>
                                <div className="itemQuantity w-1/3">
                                    <div className="flex w-15 items-center border-black border rounded-lg shadow-md">
                                        <div
                                            className="minus w-full text-center text-sm text-red-600 px-2 text-align-webkit"
                                            onClick={() => handleDecrement(item)}
                                        >
                                            <FaMinus />
                                        </div>
                                        <div className="quantity w-full text-center text-black text-md p-1 bg-red-300 e-full px-2">
                                            {item.quantity}
                                        </div>
                                        <div
                                            className="plus w-full  text-center text-sm px-2  text-red-600 text-align-webkit"
                                            onClick={() => handleIncrement(item)}
                                        >
                                            <FaPlus />
                                        </div>
                                    </div>
                                    <div className="itemQuantityWisePrice mt-2 flex justify-end items-center font-semibold text-lg">
                                        <div><CurrencyRupeeIcon className='rupeesIcon' /></div>
                                        <p className='mt-1'>{item?.variantDetails.price * item.quantity}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="border-t-2 bg-white w-full overflow-hidden  mt-2">
                            <TextField
                                id="standard-start-adornment"
                                sx={{ m: 1 }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><TiDocumentText /></InputAdornment>,
                                }}
                                placeholder='Any Special Cooking Request?'
                                variant="standard"
                                className='commentInput'
                            />
                        </div>
                        <div className="bg-white border-t-2 w-full p-3 my-4">
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
                        <div className="bg-white w-full border-t-4 p-3 my-4">
                            <div className="text-start font-bold tracking-wide">Bill Details:</div>
                            <div className="flex my-2 justify-between">
                                <div>Total Items</div>
                                <div>{totalItems}</div>
                            </div>
                            <hr />
                            <div className="flex my-2 justify-between">
                                <div>Pay To</div>
                                <div>Rs. {totalPrice}</div>
                            </div>
                        </div>
                        <div className="bg-white w-full border-t-4 p-3 my-4">
                            <div className="text-start font-bold mt-5">Cancellation Policy</div>
                            <p className='text-start'>As a general rule Buyer shall not be entitled to cancel Order once placed.  Buyer may choose to cancel Order only within one-minute of the Order being placed. </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='flex justify-center items-center h-screen'>
                    <div className='flex justify-center'>
                        <div className='text-center'>
                            <ShoppingCartOutlinedIcon className='text-red-600 textSize'></ShoppingCartOutlinedIcon> <br />
                            <p className='text-xl'>Cart Is Empty</p>
                        </div>
                    </div>
                </div>

            )}
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={handleChange}
                >
                    <BottomNavigationAction value="home" icon={<HomeIcon />} />
                    <BottomNavigationAction value="cart" icon={<Badge badgeContent={totalItems} color="error">
                        <ShoppingCartOutlinedIcon className={`${color ? 'text-red-600' : ''}`} />
                    </Badge>} />
                    <BottomNavigationAction value="archive" icon={<ArchiveIcon />} />
                </BottomNavigation>
            </Paper>
        </Box>
    );
}

export default Cart;