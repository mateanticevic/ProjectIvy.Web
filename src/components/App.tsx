import React from 'react';
import NavigationBar from './common/NavigationBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { userApi } from '../api/main';
import { User } from 'types/users';

type State = {
  user?: User
}

class App extends React.Component<{}, State> {

  state: State = {
    user: undefined
  }

  private readonly AppContext = React.createContext('default');

  componentDidMount() {
    userApi.get().then(user => this.setState({ user }));
  }

  render() {
    const isLoggedIn = window.localStorage.getItem("token") != undefined;

    return (
      <div>
        <div id="main">
          {isLoggedIn &&
            <NavigationBar user={this.state.user} />
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
