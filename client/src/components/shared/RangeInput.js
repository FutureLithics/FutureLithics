import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const RangeInput = (props) => {
  const { options, handler, value } = props;

  const styles = {
    "--value": value,
    "--min": options.minValue,
    "--max": options.maxValue
  }

  const onChangeFunction = (e) => {
    const el = e.target;
    el.style.setProperty("--value", el.value);
    el.style.setProperty("--min", el.min === "" ? "0" : el.min);
    el.style.setProperty("--max", el.max === "" ? "100" : el.max);

    handler(e.target.value, options.inner)
  };

  return (
    <div>
      <div>
        <p className="mb-0 text-secondary pe-4">{options.label}</p>
      </div>
      <div className="range-input p-1">
        <input
          type="range"
          className="range-input-element"
          min={options.minValue}
          max={options.maxValue}
          step={options.step}
          onChange={(e) => onChangeFunction(e)}
          value={value}
          style={styles}
        />
      </div>
    </div>
  );
};

RangeInput.propTypes = {
  options: PropTypes.object,
  handler: PropTypes.func,
  value: PropTypes.any,
};

export default RangeInput;