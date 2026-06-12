import React from "react";

const Button = () => {
  return (
    <button className="button" onClick={props.onClick}>
      {props.value}
    </button>
  );
};


export default Button;
