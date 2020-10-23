import React from 'react';
import { Link } from 'react-router-dom';
import { RoutePaths } from '../../constants';

export const Footer = () => {
  return (
    // <footer className="footer-7 text-center-xs  bg--secondary">
    <footer>
      <div className="container-custom">
        <div className="col-12" style={{ padding: '0px 30px' }}>
          <div className="row">
            <div
              id="menu-feature-footer-id"
              className="col-12 col-sm-12 col-md-12 col-lg-10"
              style={{ marginTop: 5, marginBottom: 5 }}
            >
              <div className="col-12">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-footer-sitename">
                    <span className="type--fine-print">
                      ©<span className="update-year">{new Date().getFullYear()}</span> Belooga Beta — All Rights Reserved
                    </span>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-8" id="sub-menu-feature-footer-id">
                    <Link className="type--fine-print" to={RoutePaths.POLICY}>
                      Privacy Policy
                    </Link>
                    <Link className="type--fine-print" to={RoutePaths.TERM_AND_CONDITION}>
                      Terms and Conditions
                    </Link>
                    <a className="type--fine-print" href={RoutePaths.HELP}>
                      Help
                    </a>
                    <a className="type--fine-print" href={RoutePaths.CAREERS}>
                      Careers
                    </a>
                    <a className="type--fine-print" href={RoutePaths.BLOG}>
                      Blog
                    </a>
                    <Link className="type--fine-print" to={RoutePaths.CONTACT_US}>
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="col-md-3 text-sm-center text-md-right"> */}
            <div className="col-12 col-sm-12 col-md-12 col-lg-2" style={{ marginTop: 5, marginBottom: 5 }}>
              <ul className="social-list list-inline" id="share-feature-footer-id" style={{ margin: 0 }}>
                {/* <li>
                  <a href="#" target="_blank">
                    <i className="socicon socicon-google icon icon--xs" />
                  </a>
                </li> */}
                <li>
                  <a href="https://twitter.com/getbelooga" target="_blank">
                    <i className="socicon socicon-twitter icon icon--xs" />
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/getbelooga" target="_blank">
                    <i className="socicon socicon-facebook icon icon--xs" />
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/getbelooga" target="_blank">
                    <i className="socicon socicon-instagram icon icon--xs" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
