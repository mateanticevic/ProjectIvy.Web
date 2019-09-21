import React from 'react';
import NavigationBar from './common/NavigationBar';

class App extends React.Component {

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
      </div>
    );
  }
}

export default App;
