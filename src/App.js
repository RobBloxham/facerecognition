import React, { useState } from 'react';
import ParticlesBg from 'particles-bg';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';



const setupClarifai = (imageUrl) => {
  const PAT = '';
  const USER_ID = '';       
  const APP_ID = '';
  const MODEL_ID = 'face-detection';  
  const IMAGE_URL = {imageUrl};

  const returnClarafaiRequestOptions = JSON.stringify({
   "user_app_id": {
       "user_id": USER_ID,
       "app_id": APP_ID
   },
   "inputs": [
       {
           "data": {
               "image": {
                   "url": IMAGE_URL
               }
           }
       }
   ]
 });
 const requestOptions = {
   method: 'POST',
   headers: {
       'Accept': 'application/json',
       'Authorization': 'Key ' + PAT
   },
   body: requestOptions
 };
 return requestOptions;
  

}

const App = () => {
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [box, setBox] = useState({});
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  });

  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    });
  }

  const calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    };
  }

  const displayFaceBox = (box) => {
    setBox(box);
  }

  const onInputChange = (event) => {
    setInput(event.target.value);
  }

  const onButtonSubmit = ({ returnClarafaiRequestOptions, MODEL_ID }) => {
    setImageUrl(input);
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + "/outputs", returnClarafaiRequestOptions(input))
    .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              setUser(Object.assign(user, { entries: count }));
            });
        }
        displayFaceBox(calculateFaceLocation(response));
      })
      .catch(err => console.log(err));
  }

  const onRouteChange = (route) => {
    if (route === 'signout') {
      setIsSignedIn(false);
    } else if (route === 'home') {
      setIsSignedIn(true);
    }
    setRoute(route);
  }

  return (
    <div className="App">
      <ParticlesBg type="circle" bg={true} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      {route === 'home' ? (
        <div>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit} />
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
      ) : (
        route === 'signin' ? <Signin loadUser={loadUser} onRouteChange={onRouteChange} /> :
          <Register loadUser={loadUser} onRouteChange={onRouteChange} />
      )}
    </div>
  );
}

export default App;
