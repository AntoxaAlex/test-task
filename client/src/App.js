import React,{useState,useEffect} from 'react';
import {REGISTER_USER, LOGIN_USER, RETURN_ID, LATENCY, LOGOUT} from "./queries"
import axios from "axios";

const App = () => {
    const [state,setState] = useState({
        isAuth:false,
        isLogin:true,
        auth:{
            id:"",
            password: ""
        },
        returnedId:"",
        latency:"",
        removeAllTokens:false
    })

    useEffect(()=>{
        if(localStorage.getItem("token")){
            setState({...state, isAuth:true})
        }
    },[])


    const {id,password} = state.auth

    const onChangeValue = (e) => {
        const {name,value} = e.target
        setState({...state,auth: {...state.auth,[name]:value}})
    }
    const submitAuthForm = async (e) => {
        e.preventDefault()
        const body = JSON.stringify({
            query: state.isLogin ? LOGIN_USER : REGISTER_USER,
            variables:{
                id,
                password
            }
        });
        const config = {
            headers:{
                "Content-Type": "application/json"
            }
        }
        console.log(body)
        try{
            const res = await axios.post("http://localhost:4000/graphql",body,config)
            if(state.isLogin){
                if(res.data.data.signIn.token){
                    localStorage.setItem("token",res.data.data.signIn.token);
                    setState({...state,isAuth: true})
                }
            } else if(!state.isLogin){
                if(res.data.data.signUp.token){
                    localStorage.setItem("token",res.data.data.signUp.token);
                    setState({...state,isAuth: true})
                }
            }
        }catch (e) {
            console.log(e)
        }
    }

    const returnId = async (e) => {
        e.preventDefault();
        const body = JSON.stringify({
            query: RETURN_ID
        });
        const config = {
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }
        try {
            const res = await axios.post("http://localhost:4000/graphql",body,config);
            if(res.data.data.info._id){
                setState({...state,returnedId: res.data.data.info._id})
            }
        }catch (e) {
            console.log(e.message)
        }
    }

    const getLatency = async (e) => {
        e.preventDefault();
        const body = JSON.stringify({
            query: LATENCY
        });
        const config = {
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }
        try {
            const res = await axios.post("http://localhost:4000/graphql",body,config);
            if(res.data.data.latency){
                setState({...state,latency: res.data.data.latency})
            }
        }catch (e) {
            console.log(e.message);
        }
    }

    const logout = async (e) => {
        e.preventDefault();
        const body = JSON.stringify({
            query: LOGOUT,
            variables:{
                all:state.removeAllTokens
            }
        });
        const config = {
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }
        try {
            const res = await axios.post("http://localhost:4000/graphql",body,config)
            console.log(res)
            localStorage.clear();
            setState({...state,isAuth: false})
        }catch (e) {
            console.log(e.message)
        }
    }

    return (
        <div className="main-div">
            {state.isAuth ? <div className="content-div">
                <div className="row">
                    <div className="col-3">
                        <button className="btn btn-success" type="button" onClick={(e)=>returnId(e)}>Get user's Id</button>
                    </div>
                    <div className="col-9">
                        <p>Returned id: {state.returnedId}</p>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-3">
                        <button className="btn btn-warning" type="button" onClick={(e)=>getLatency(e)}>Get latency</button>
                    </div>
                    <div className="col-9">
                        <p>Latency: {state.latency ? state.latency + "sec":""}</p>
                    </div>
                </div>
                <hr/>
                <div>
                    <div>
                        <label className="form-label" htmlFor="check">Remove all tokens?</label>
                        <input id="check" type="checkbox" onChange={()=>setState({...state,removeAllTokens: !state.removeAllTokens})}/>
                    </div>
                    <button className="btn btn-danger" type="button" onClick={(e)=>logout(e)}>Logout</button>
                </div>
            </div> : <div className="auth-div">
                <form onSubmit={(e)=>submitAuthForm(e)}>
                    <h1 className="text-center">{state.isLogin ? "Sign in" : "Sign up"}</h1>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="id">Id</label>
                        <input
                            type="text"
                            autoComplete="off"
                            className="form-control"
                            autoFocus="autofocus"
                            placeholder="Email/Phone"
                            name="id"
                            id="id"
                            value={id}
                            onChange={(e)=>onChangeValue(e)}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            type="password"
                            autoComplete="off"
                            className="form-control"
                            autoFocus="autofocus"
                            placeholder="Email/Phone"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e)=>onChangeValue(e)}/>
                    </div>
                    <p className="mb-3">
                        {state.isLogin ? "Don't have an account" : "Have an account"}
                        <button type="button" className="btn btn-sm btn-outline-light" onClick={()=>setState({...state,isLogin: !state.isLogin})}>{state.isLogin ? "Sign up" : "Sign in"}</button>
                    </p>
                    <div className="mb-3 text-center">
                        <button className="btn btn-lg btn-primary" type="submit">Submit</button>
                    </div>
                </form>
            </div> }
        </div>
)
    ;
};

export default App;
