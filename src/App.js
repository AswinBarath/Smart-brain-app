import React, { Component } from 'react';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Navigation from './components/Navigation/Navigation'
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register'
import Logo from './components/Logo/Logo'
import Rank from './components/Rank/Rank'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import { API_ENDPOINTS } from './config';
import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 75,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false, 
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      },
      isLoading: false,
      error: ''
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false, 
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      },
      isLoading: false,
      error: ''
    }
  }

  loadUser = (data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    try {
      console.log('API Response:', data);
      
      // Handle error response from API
      if (typeof data === 'string' && data.includes('unable to work with API')) {
        console.log('API Error:', data);
        return null;
      }
      
      // Check if the response has the expected structure for newer Clarifai API
      if (data && data.outputs && data.outputs[0] && data.outputs[0].data) {
        const regions = data.outputs[0].data.regions;
        if (regions && regions.length > 0) {
          const clarifaiFace = regions[0].region_info.bounding_box;
          const image = document.getElementById('inputimage');
          
          if (!image) {
            console.log('Image element not found');
            return null;
          }
          
          const width = Number(image.width);
          const height = Number(image.height);
          
          return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
          }
        }
      }
      
      // Check for alternative response structure
      if (data && data.data && data.data.regions && data.data.regions.length > 0) {
        const clarifaiFace = data.data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage');
        
        if (!image) {
          console.log('Image element not found');
          return null;
        }
        
        const width = Number(image.width);
        const height = Number(image.height);
        
        return {
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - (clarifaiFace.right_col * width),
          bottomRow: height - (clarifaiFace.bottom_row * height)
        }
      }
      
      console.log('No face detected or invalid response structure:', data);
      return null;
    } catch (error) {
      console.log('Error calculating face location:', error);
      return null;
    }
  }
  
  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  // Test function to debug API
  testAPI = () => {
    console.log('Testing API endpoints...');
    console.log('API Base URL:', API_ENDPOINTS.IMAGE_URL);
    
    // Test with a known working image URL
    const testImageUrl = 'https://samples.clarifai.com/face-det.jpg';
    console.log('Testing with image URL:', testImageUrl);
    
    fetch(API_ENDPOINTS.IMAGE_URL, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          input: testImageUrl
      })
    })
    .then(response => {
      console.log('Test API Response Status:', response.status);
      console.log('Test API Response Headers:', response.headers);
      return response.text();
    })
    .then(text => {
      console.log('Test API Response Text:', text);
      try {
        const json = JSON.parse(text);
        console.log('Test API Response JSON:', json);
      } catch (e) {
        console.log('Test API Response is not JSON:', text);
      }
    })
    .catch(err => {
      console.log('Test API Error:', err);
    });
  }

  onButtonSubmit = () => {
    const imageUrl = this.state.input.trim();
    
    // Validate input
    if (!imageUrl) {
      this.setState({ error: 'Please enter an image URL.' });
      return;
    }
    
    // Basic URL validation
    try {
      new URL(imageUrl);
    } catch (e) {
      this.setState({ error: 'Please enter a valid image URL.' });
      return;
    }
    
    console.log('Sending image URL to API:', imageUrl);
    this.setState({imageUrl: imageUrl, isLoading: true, error: ''})
    
    fetch(API_ENDPOINTS.IMAGE_URL, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            input: imageUrl
        })
      })
      .then(response => {
        console.log('API Response Status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(response => {
        console.log('Full API Response:', response);
        
        // Check if API returned an error
        if (typeof response === 'string' && response.includes('unable to work with API')) {
          this.setState({ 
            isLoading: false, 
            error: 'API service temporarily unavailable. Please try again later.' 
          });
          return;
        }
        
        if(response) {
          fetch(API_ENDPOINTS.IMAGE, {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(prevState => ({
              user: { ...prevState.user, entries: count }
            }))
          })
          .catch(err => {
            console.log('Error updating entries:', err);
          })
        }
        
        const box = this.calculateFaceLocation(response);
        if (box) {
          this.displayFaceBox(box);
          this.setState({ isLoading: false });
        } else {
          this.setState({ 
            isLoading: false, 
            error: 'No face detected in the image. Please try a different image with a clear face.' 
          });
        }
      })
      .catch(err => {
        console.log('Network error:', err);
        let errorMessage = 'Network error. Please check your internet connection and try again.';
        
        if (err.message.includes('400')) {
          errorMessage = 'Invalid image URL or API request. Please check the URL and try again.';
        } else if (err.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        this.setState({ 
          isLoading: false, 
          error: errorMessage
        });
      });
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, box} = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'
              ? <div>
                  <Logo />
                  <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                  <ImageLinkForm
                    onInputChange={this.onInputChange}
                    onButtonSubmit={this.onButtonSubmit}
                    onTestAPI={this.testAPI}
                    isLoading={this.state.isLoading}
                    error={this.state.error}
                  />
                  <FaceRecognition box={box} imageUrl={imageUrl}/>
                </div>
              : (
                route === 'signin'
                 ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                 : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              )}
      </div>
    );
  }
}

export default App;

