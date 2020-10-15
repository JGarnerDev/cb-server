// Firebase connection
var firebaseConfig = {
  apiKey: "AIzaSyCgkjk9hPKgGIJOfjLNotj46_J4ViNT5Zs",
  authDomain: "codepen-chatterbox.firebaseapp.com",
  databaseURL: "https://codepen-chatterbox.firebaseio.com",
  projectId: "codepen-chatterbox",
  storageBucket: "codepen-chatterbox.appspot.com",
  messagingSenderId: "73501066368",
  appId: "1:73501066368:web:ae74ab2e3f91ae97751265",
  measurementId: "G-5FBB9TH8Q5",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Removing the chat

// Models

class User {
  constructor(name) {
    this.name = name;
    this.currentRoom = "Main Room";
    this.login();
  }
  login() {
    //   Add the user to users db collection, keep the id from database
    this.id = usersRef.push(this).getKey();
    //   Add the user to the current room
    roomCurrentUsersRef(this.currentRoom).push(this);
  }
  logout() {
    usersRef.child(this.id).remove();
  }
  sendMessage(body) {
    const message = { name: this.name, body };
    messageCurrentRoomRef(this.currentRoom).push(message);
  }
}

let user;

// Database references

//      We will support multiple rooms, so the reference will be made dynamically
const messageCurrentRoomRef = (room) => {
  return db.ref(`/rooms/${room}/messages`);
};
const roomCurrentUsersRef = (room) => {
  return db.ref(`/rooms/${room}/users`);
};

//      There will be another collection just for the users
const usersRef = db.ref("/users");

// Utility functions

//      Getting elements
const getEleById = (id) => {
  return document.getElementById(id);
};
const getEleByClass = (className) => {
  return document.getElementsByClassName(className);
};

// DOM Elements
const loginPage = getEleById("login");
const loginForm = getEleById("login-form");
const loginButton = getEleById("login-submit");

const chatPage = getEleById("chat");
const chatHeader = getEleById("chat-header");
const chatInput = getEleById("chat-input");
const chatButton = getEleById("chat-submit");

//      ...their event listeners

loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  // Take the username value from the form
  const username = loginForm.username.value;
  // redefine the user variable as class object with the name
  user = new User(username);
  // Take away the login page element from the DOM
  loginPage.remove();
  // Bring the chat page element out of the hide class
  chatPage.classList.remove("hide");
  // Change the chat header to the room the user is in
  chatHeader.innerText = user.currentRoom;
});

chatButton.addEventListener("click", (e) => {
  e.preventDefault();
  //   Take the message value from the form
  const message = chatInput.value;
  //   Use the class method to send the message
  user.sendMessage(message);
});
