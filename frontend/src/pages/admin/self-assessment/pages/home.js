import React from 'react';
import proptypes from 'prop-types';
import Personal from '../personal';

/**
 * Home component for the self-assessment admin page.
 * Currently renders the Personal section inside a container.
 *
 * @returns {JSX.Element} Rendered home page component containing personal section.
 */
const Home = () => {
  return (
    <div>
      // Render the Personal self-assessment form section
      <Personal />
    </div>
  );
};

Home.propTypes = {
  showSideBar: proptypes.any,
};

export default Home;
