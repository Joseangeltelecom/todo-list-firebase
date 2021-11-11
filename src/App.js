import React from "react"
import "./App.css"
import { useState, useEffect } from "react"
import { Button, FormControl, InputLabel, Input } from "@mui/material"
import Todo from "./Todo"
import { db } from "./firebase/firebase-config"
import Login from "./Login"
import Hero from "./Hero"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth"

import {
  collection,
  addDoc,
  query,
  onSnapshot,
  serverTimestamp,
  orderBy,
} from "firebase/firestore"

function App() {
  const [todos, setTodos] = useState([""]) // short-time memory the state. Use state is going to set up that short-time memory.
  const [input, setInput] = useState("")
  const [user, setUser] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [hasAccount, setHasAccount] = useState(false)

  const auth = getAuth()

  const clearInputs = () => {
    setEmail("")
    setPassword("")
  }

  const clearError = () => {
    setEmailError("")
    setPasswordError("")
  }

  // create new account:
  const handleSignUp = () => {
    clearError()
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        // ...
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/email-already-in-use":
          case "auth/invalid-email":
            setEmailError(error.message)
            break
          case "auth/weak-password":
            setPasswordError(error.message)
            break
        }
      })
  }

  // Log in existing account:
  const handleSignIn = () => {
    clearError()
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        // ...
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found":
            setEmailError(error.message)
            break
          case "auth/wrong-password":
            setPasswordError(error.message)
            break
        }
      })
  }

  // Log in with google:
  async function login() {
    try {
      var provider = new GoogleAuthProvider()
      await signInWithPopup(getAuth(), provider)
    } catch (error) {
      console.error(error)
    }
  }

  // Log out:
  function handleLogout() {
    signOut(auth)
    console.log("I'm out")
  }

  const authListener = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        clearInputs()
        setUser(user)
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid
        // ...
      } else {
        // User is signed out
        setUser("")
      }
    })
  }

  // when  the app loads, we need to  listen to the database and fectch new todos as they add/remove.

  useEffect(() => {
    authListener()
    // this code here.. fires when the app.js loads.
    getItems()
  }, [])

  function getItems() {
    // Create the query to load the last 12 messages and listen for new ones.
    const recentMessagesQuery = query(
      collection(db, "todos"),
      orderBy("timestamp", "desc")
    )
    onSnapshot(recentMessagesQuery, (snapshot) => {
      setTodos(
        snapshot.docs.map((doc) => ({ id: doc.id, todo: doc.data().todo }))
      )
    })
  }

  const addTodo = (e) => {
    e.preventDefault()
    addDoc(collection(db, "todos"), {
      todo: input,
      timestamp: serverTimestamp(),
    })
    setInput("")
  }

  return (
    <div className="App">
      {user ? (
        <>
          <nav>
            <h2>Welcome My React - Firebase 🔥- Todo List.</h2>
            <button onClick={handleLogout}>Logout</button>
          </nav>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "15px",
            }}
          >
            <form>
              <FormControl>
                <InputLabel>✅ Write a Todo</InputLabel>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </FormControl>

              <Button disabled={!input} type="submit" onClick={addTodo}>
                Add Todo
              </Button>
            </form>
          </div>
          <ul>
            {todos.map((todo) => (
              <Todo todo={todo} />
            ))}
          </ul>
        </>
      ) : (
        <Login
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSignIn={handleSignIn}
          handleSignUp={handleSignUp}
          hasAccount={hasAccount}
          setHasAccount={setHasAccount}
          emailError={emailError}
          passwordError={passwordError}
        />
      )}
    </div>
  )
}

export default App
