import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

/**
 * Google modern loader component
 */
class Component extends React.Component {
  /**
   * propTypes
   * @return {any}
   */
  static get propTypes() {
    return {
      children: PropTypes.any,
      color: PropTypes.string,
    };
  }

  /**
   * Component constructor
   * @param {*} props
   */
  constructor(props) {
    super(props);
  }

  /**
   * Component render method
   * @return {string}
   */
  render() {
    return (
      <>
        <div className="circular-loader">
          <svg className="vector" viewBox="25 25 50 50">
            <circle
              className="path"
              cx="50"
              cy="50"
              r="20"
              fill="none"
              strokeWidth="5"
              strokeMiterlimit="10"
            />
          </svg>
        </div>
        <style>
          {this.props.color &&
            `
              @keyframes color {
                0%,
                100% {
                  stroke: ${this.props.color};
                }
              }
            `}
        </style>
      </>
    );
  }
}

export default Component;
