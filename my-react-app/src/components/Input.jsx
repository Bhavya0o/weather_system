import React from "react";

const Input = (props) => {
  return (
    <input
      className="input"
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
    />
  );
};

export default Input;





