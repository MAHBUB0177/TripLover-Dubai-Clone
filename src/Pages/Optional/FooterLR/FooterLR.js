import React from 'react';
import { Link } from 'react-router-dom';
import './FooterLR.css'

const FooterLR = () => {
    return (
        <footer className="row pb-5 pt-3">
          <div className="col-lg-12 text-center">
            <span className="text-white fw-bold fs-6"><Link to="/contact" className="text-white">Contact</Link><span className="mx-1">|</span></span>
            <span className="text-white fw-bold fs-6"><Link to="/bankdetail" className="text-white">Bank Details</Link> <span className="me-1">|</span></span>
            <span className="text-white fw-bold fs-6"><Link to="/privacypolicy" className="text-white">Privacy Policy</Link> <span className="me-1">|</span></span>
            <span className="text-white fw-bold fs-6"><Link to="/termandcondition" className="text-white">Terms and Conditions</Link> <span className="me-1">|</span></span>
            <span className="text-white fw-bold fs-6"><Link to="/refundandcancellation" className="text-white">Refund & Cancellation</Link><span className="mx-1">|</span></span>
            <span className="text-white fw-bold fs-6"><Link to="/faq" className="text-white">FAQ</Link></span>
          </div>
        </footer>
    );
};

export default FooterLR;