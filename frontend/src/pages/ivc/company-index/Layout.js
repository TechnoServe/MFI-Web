import React from 'react';
import Header from './header';
import proptypes from 'prop-types';


const PageLayout = ({children}) => {
  return (
    <div>
      <Header/>
      {children}
    </div>
  );
};

PageLayout.propTypes = {
  children: proptypes.any,
};

export default PageLayout;
