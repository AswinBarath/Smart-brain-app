import React from 'react';
import { API_ENDPOINTS } from '../../config';
import './Signin.css'

class Signin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signInEmail: '',
            signInPassword: '',
            isLoading: false,
            error: ''
        }
    }

    onEmailChange = (event) => {
        this.setState({signInEmail: event.target.value})
    }

    onPasswordChange = (event) => {
        this.setState({signInPassword: event.target.value})
    }

    onSubmitSignIn = () => {
        this.setState({ isLoading: true, error: '' });
        fetch(API_ENDPOINTS.SIGNIN, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.signInEmail,
                password: this.state.signInPassword
            })
        })
            .then(response => response.json())
            .then(user => {
                this.setState({ isLoading: false });
                if(user.id){ // does the user exist? Did we receive a user with a property of id?
                  this.props.loadUser(user);
                  this.props.onRouteChange('home');
                } else {
                    this.setState({ error: 'Invalid credentials. Please try again.' });
                }
            })
            .catch(err => {
                this.setState({ isLoading: false, error: 'Network error. Please try again.' });
                console.log(err);
            });
    }

    render() {
        const { onRouteChange } = this.props;
        const { isLoading, error } = this.state;
        return (
            <article className="br4 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 white">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                        {error && (
                            <div className="red mb3">
                                {error}
                            </div>
                        )}
                        <div className="mt3">
                            <label className="db fw6 lh-copy f5" htmlFor="email-address">Email</label>
                            <input 
                                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 white" 
                                type="email" 
                                name="email-address"  
                                id="email-address" 
                                onChange={this.onEmailChange} />
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f5" htmlFor="password">Password</label>
                            <input
                                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 white" 
                                type="password" 
                                name="password" 
                                id="password" 
                                onChange={this.onPasswordChange} />
                        </div>
                        </fieldset>
                        <div className="white">
                            <input
                             onClick={this.onSubmitSignIn}
                             className="b ph3 pv2 input-reset ba b--white bg-transparent grow pointer f6 dib white"
                             type="submit" 
                             value={isLoading ? "Signing in..." : "Sign in"}
                             disabled={isLoading}
                            />
                            </div>
                            <div className="lh-copy mt3">
                            <p 
                                onClick={() => onRouteChange('register')}
                                className="f6 link dim white db pointer"
                            >
                                    Register
                            </p>
                        </div>
                    </div>
                </main>
            </article>
        );
    }
}

export default Signin;