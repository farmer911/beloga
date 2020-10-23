import React from 'react';

export const UnexpectedErrorSection = () => {
  return (
    <section className="height-100 bg--dark text-center">
      <div className="container pos-vertical-center">
        <div className="row">
          <div className="col-md-12">
            <h1 className="h1--large">500</h1>
            <p className="lead">An unexpected error has occured preventing the page from loading.</p>
            <a href="/">Go back to home page</a>
          </div>
        </div>
      </div>
    </section>
  );
};
