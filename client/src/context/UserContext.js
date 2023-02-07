import React, { useState } from "react"
import axios from "axios"
const UserContext = React.createContext()

const userAxios = axios.create()

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token")
    config.headers.Authorization = `Bearer ${token}`
    return config
})

function UserProvider(props) {
    const initState = {
        user: JSON.parse(localStorage.getItem("user")) || {},
        token: localStorage.getItem("token") || "",
        todos: [],
        errMsg:''
    }

    const [userState, setUserState] = useState(initState)

    const signup = credentials => {
        axios.post('/auth/signup', credentials)
            .then(res => {
                const { user, token } = res.data
                //save both token and user in localstorage
                localStorage.setItem("token", token)
                localStorage.setItem("user", JSON.stringify(user))
                setUserState(prev => ({
                    ...prev,
                    user,
                    token
                }))
            })
            .catch(err => handleAuthErr(err.response.data.errMsg))
    }

    const login = credentials => {
        axios.post('/auth/login', credentials)
            .then(res => {
                const { user, token } = res.data
                //save both token and user in localstorage
                localStorage.setItem("token", token)
                localStorage.setItem("user", JSON.stringify(user))
                getUserTodos()
                setUserState(prev => ({
                    ...prev,
                    user,
                    token
                }))
            })
            .catch(err => handleAuthErr(err.response.data.errMsg))
    }

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUserState({
            user: {},
            token: "",
            todos: []
        })
    }

    const handleAuthErr = errMsg => {
        setUserState(prevState => ({
            ...prevState,
            errMsg
        }))
    }

    const resetAuthErr = () => {
        setUserState(prevState => ({
            ...prevState,
            errMsg:""
        }))
    }

    const getUserTodos = () => {
        userAxios.get('/api/todo/user')
        .then(res => setUserState(prevState => ({
            ...prevState,
            todos: res.data
        })))
        .catch(err => console.log(err.response.data.errMsg))
    }

    const addTodo = newTodo => {
        userAxios.post("/api/todo", newTodo)
        .then(res => setUserState(prevState => ({
            ...prevState,
            todos: [prevState.todos, res.data]
        })))
        .catch(err => console.log(err.response.data.errMsg))
    }

    return (
        <UserContext.Provider value={{ ...userState, signup, login, logout, addTodo, resetAuthErr }}>
            {props.children}
        </UserContext.Provider>
    )
}

export { UserProvider, UserContext }