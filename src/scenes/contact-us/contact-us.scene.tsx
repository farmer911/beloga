import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createForm } from 'rc-form';
import { ContactForm } from './contact-form/contact-form';
import { contactAction } from '../../ducks/contact.duck';
interface ContactUsSceneProps {
  contactAction: any;
  isRedirect: boolean;
  history: any;
  isLoading: boolean;
  errorFromServer: string;
}

const enhanceContactForm = createForm()(ContactForm);

class ContactUsScene extends Component<ContactUsSceneProps> {
  submitContactUs = (data: any) => {
    const { contactAction } = this.props;
    return contactAction(data);
  };

  render() {
    const EnhanceContactForm = enhanceContactForm;
    const { isLoading, errorFromServer } = this.props;
    return (
      <div className="main-container">
        <section className="text-center height-30 contact-us">
          <div className="container pos-vertical-center">
            <div className="row">
              <div className="col-md-8 col-lg-6">
                <h1>Contact Us</h1>
              </div>
            </div>
          </div>
        </section>
        <section className=" bg--secondary contact-us-content">
          <div className="container">
          <div className="content-sub">Ask a question, leave a comment, or report an issue.</div>
            <div className="row justify-content-center no-gutters">
              <div className="col-md-10 col-lg-8">
                <div className="boxed boxed--border">
                  <EnhanceContactForm
                    isLoading={isLoading}
                    actionSubmit={this.submitContactUs}
                    errorFromServer={errorFromServer}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {};
};

export default connect(
  mapStateToProps,
  {
    contactAction
  }
)(ContactUsScene);
