import React from 'react';
import { RoutePaths } from '../../commons/constants';
import { Link } from 'react-router-dom';

const NotFoundScene = () => {
  return (
    <React.Fragment>
      <section className="height-100 bg--dark text-center">
        <div className="container pos-vertical-center">
          <div className="row">
            <div className="col-md-12">
              <h1 className="h1--large">404</h1>
              <p className="lead">The page you were looking for was not found.</p>
              <Link to={RoutePaths.INDEX}>Go back to home page</Link>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default NotFoundScene;
