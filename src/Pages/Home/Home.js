/* eslint-disable no-unused-vars */
import * as React from 'react';
import { Card, Paper } from '@mui/material'
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
import CssBaseline from '@mui/material/CssBaseline';

function Home() {

    const [activeTab, setActiveTab] = React.useState('Dine In');
    const [value, setValue] = React.useState('recents');
    const navigate = useNavigate();

    const sectionName = [
        'Hotdog',
        'Burger',
        'Pizza',
        'Toast sandwich',
        'Garlic Bread',
        'French Fries'
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar component="nav">
                <div className="w-full  flex bg-gray-100 p-2">
                    <div
                        onClick={() => setActiveTab('Dine In')}
                        className="cursor-pointer w-1/2 text-center">
                        <p className={`w-full  ${activeTab === 'Dine In' ? ' bg-red-700 text-white' : 'text-black'} py-2 rounded-lg`}>
                            Dine In
                        </p>
                    </div>
                    <div
                        onClick={() => setActiveTab('Pick Up')}
                        className="cursor-pointer w-1/2 text-center">
                        <p className={`w-full  ${activeTab === 'Pick Up' ? ' bg-red-700 text-white' : 'text-black'} py-2 rounded-lg`}>
                            Pick Up
                        </p>
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
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                >
                    <BottomNavigationAction onClick={() => { navigate('/cart') }} label="Cart" icon={<ShoppingCartOutlinedIcon />} />
                    <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
                    <BottomNavigationAction label="Archive" icon={<ArchiveIcon />} />
                </BottomNavigation>
            </Paper>
        </Box>
    );
}

export default Home;
