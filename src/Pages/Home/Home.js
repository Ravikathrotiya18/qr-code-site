/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Badge, Card, Paper } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import BhagawatiLogo from '../../assets/bhagwatiHeaderLogo.png';
import ArchiveIcon from '@mui/icons-material/Archive';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import './css/Cart.css';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';
import { selectCartItems } from '../../app/features/Cart/CartSlice';
import './css/Home.scss';
import { io } from 'socket.io-client';

const initialDisableTimes = {
    Hotdog: { start: '16:00', end: '17:19' },
    Burger: { start: '14:00', end: '15:00' },
};

function Home() {
    const [activeTab, setActiveTab] = useState('Dine In');
    const [value, setValue] = useState('home');
    const [color, setColor] = useState(false);
    const [disableTimes, setDisableTimes] = useState(initialDisableTimes);
    const [disabledSections, setDisabledSections] = useState({});
    const navigate = useNavigate();
    const cartItems = useSelector(selectCartItems);

    useEffect(() => {
        const socket = io('http://localhost:3000'); 
        socket.on('updateDisableTimes', (updatedDisableTimes) => {
            setDisableTimes(updatedDisableTimes);
        });
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const updateDisabledSections = () => {
            const currentTime = new Date();
            const newDisabledSections = {};

            for (const section in disableTimes) {
                const [startHours, startMinutes] = disableTimes[section].start.split(':').map(Number);
                const [endHours, endMinutes] = disableTimes[section].end.split(':').map(Number);

                const startTime = new Date();
                startTime.setHours(startHours, startMinutes, 0, 0);

                const endTime = new Date();
                endTime.setHours(endHours, endMinutes, 0, 0);

                newDisabledSections[section] = currentTime >= startTime && currentTime <= endTime;
            }

            setDisabledSections(newDisabledSections);
        };

        updateDisabledSections();
        const interval = setInterval(updateDisabledSections, 60000);

        return () => clearInterval(interval);
    }, [disableTimes]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 'cart') {
            navigate('/cart');
            setColor(true);
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
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <CssBaseline />
            <div className="container">
                <div className="headerLogo">
                    <div className="logoContainer">
                        <img src={BhagawatiLogo} alt="Bhagawati Logo" className='logo' />
                    </div>
                </div>
            </div>

            <AppBar position="sticky" sx={{ boxShadow: 0 }}>
                {/* <div className="p-2 bg-white">
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
                </div> */}
            </AppBar>
            <div className="m-4 flex justify-around gap-4 flex-wrap">
                {sectionName.map((section, index) => (
                    <div key={index}>
                        <Card
                            variant="outlined"
                            className={`w-36 p-2 h-36 text-center hover:cursor-pointer ${disabledSections[section] ? 'disabled-card' : ''}`}
                            onClick={() => {
                                if (!disabledSections[section]) {
                                    navigate('/singleProduct', { state: { sectionName: section } });
                                }
                            }}
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
