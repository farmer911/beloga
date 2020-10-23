import React from 'react';

interface FormErrorPropTypes {
  text: string;
}

export const FormError = (props: FormErrorPropTypes) => (
  <div className="custom-form-error text-danger">{props.text}</div>
);
