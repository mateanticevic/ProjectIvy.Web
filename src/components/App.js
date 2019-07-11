import React from 'react';
import PropTypes from 'prop-types';
import NavigationBar from './common/NavigationBar';
import ReduxToastr from 'react-redux-toastr';

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const isLoggedIn = window.localStorage.getItem("token") != undefined;

    return (
      <div>
        <div id="main">
          {isLoggedIn &&
            <NavigationBar />
          }
          {this.props.children}
        </div>
        <ReduxToastr
          timeOut={4000}
          newestOnTop={false}
          preventDuplicates
          position="top-right"
          transitionIn="fadeIn"
          transitionOut="fadeOut"
          progressBar />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element
};

export default App;
