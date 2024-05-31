/* eslint-disable no-unused-vars */
import * as React from 'react';
import { Badge, Card, CircularProgress, Paper } from '@mui/material'
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import './css/Cart.css'
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';
import { selectCartItems } from '../../app/features/Cart/CartSlice';
import './css/Home.scss'

function Home() {

    const [activeTab, setActiveTab] = React.useState('Dine In');
    const [value, setValue] = React.useState('home');
    const [color, setColor] = React.useState(false)
    const navigate = useNavigate();
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


    const sectionName = [
        'Hotdog',
        'Burger',
        'Pizza',
        'Toast sandwich',
        'Garlic Bread',
        'French Fries'
    ];

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar component="nav">
                <div className="p-2 bg-white">
                    <div className="tab-container">
                        <div
                            className={`tab ${activeTab === 'Dine In' ? 'active' : ''} text-black font-medium `}
                            onClick={() => handleTabClick('Dine In')}
                        >
                            DINE IN
                        </div>
                        <div
                            className={`tab ${activeTab === 'Pick Up' ? 'active' : ''} text-black font-medium`}
                            onClick={() => handleTabClick('Pick Up')}
                        >
                            PICK UP
                        </div>
                        <div className="indicator" style={{ transform: activeTab === 'Dine In' ? 'translateX(0)' : 'translateX(100%)' }}></div>
                    </div>
                </div>
            </AppBar>
            <div className="m-4 py-14 flex justify-around gap-4 flex-wrap">
                {sectionName.map((section, index) => (
                    <div key={index}>
                        <Card
                            variant="outlined"
                            className='w-36 p-2 h-36 text-center hover:cursor-pointer'
                            onClick={() => navigate('/singleProduct', { state: { sectionName: section } })}
                        >
                            <p className='mt-14'>{section}</p>
                        </Card>
                    </div>
                ))}
            </div>
            {/* <CircularProgress color="error" /> */}
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

export default Home;
