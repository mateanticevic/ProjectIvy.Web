import React from 'react';
import NavigationBar from './common/NavigationBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          draggable
          pauseOnHover
        />
      </div>
    );
  }
}

export default App;
