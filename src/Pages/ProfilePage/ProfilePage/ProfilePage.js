import React from 'react';
import Footer from '../../SharePages/Footer/Footer';
import Navbar from '../../SharePages/Navbar/Navbar';
import SideNavBar from '../../SharePages/SideNavBar/SideNavBar';
import ProfilePagePanel from '../profilePagePanel/ProfilePagePanel';

const ProfilePage = () => {
    return (
        <div>
            <Navbar></Navbar>
            <SideNavBar></SideNavBar>
            <ProfilePagePanel></ProfilePagePanel>
            <Footer></Footer>
        </div>
    );
};

export default ProfilePage;