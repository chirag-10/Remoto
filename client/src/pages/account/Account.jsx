import React, {useEffect, useState} from "react"
import SideBar from "../../components/sidebar/SideBar"
import {Table, Tag, Upload, Tabs, message, notification,Button} from "antd";
import {Link} from "react-router-dom"
import { signup, getAllEmployee, getPendingEmployee, generateCSV, createMAccount } from "../../redux/actions/userAction";
import { connect } from "react-redux"
import store from "../../redux/store";
import mButton from "../../assets/img/ms-signin.png"
import xlsx from "xlsx"
import "./Account.css"

const Account = (props)=>{
  
    const [accountLoading, setAccountLoading] = useState(false)
    const [response, setResponse] = useState(null)
    const close = () => {
        store.dispatch({ type: "SET_ALERT", payload: { message: null } });
      };
      
        
      const openNotification = (err) => {
        notification["error"]({
          message: "Error in newEmployee",
          description: err,
          onClose: close,
        });
      };
    
      useEffect(() => {
        if (props.alert_message !== null && props.alert_message!= undefined) {
          openNotification(props.alert_message);
         console.log(props.alert_message)
        }
      }, [props.alert_message]);
    
    
    const createCSV = async ()=>{
        await props.generateCSV();
    }

    const createMicrosoftAccount = async ()=>{
        setAccountLoading(true)
        setResponse(null)
        let response = await props.createMAccount();
        if(response!=undefined && response!=null && response.data!=undefined && response.data.employee!=undefined){
            console.log(response)
            setResponse(response.data.employee)
        }
        setAccountLoading(false)
    }
    return(
        <>
        <SideBar/>
        <div className="account-microsoft-container">
            {
                accountLoading===true? <h2>Creating users Account....</h2>:
                <div onClick={()=>{createMicrosoftAccount()}}>
                    <h2>Sign In With Microsoft to create employee accounts</h2>
                    <img src={mButton} style={{cursor:"pointer"}} alt="Signin with Microsoft"/>
                    <br/>
                    <br/>
                    <br/>
                </div>
            }
            {   
             response && <h1>Account created for {response.length} Users</h1>
            }
        </div>
        <div>
        </div>
        </>
    )
}

const mapActionWithProps = {
    signup,
    getAllEmployee,
    getPendingEmployee,
    generateCSV,
    createMAccount
  };
  
  const mapPropsWithState = (state) => ({
    alert_message: state.user.alert_message,
    success_message: state.user.success_message,
    all_employee: state.user.all_employee,
    pending_employee: state.user.pending_employee,
  });
  
  export default connect(mapPropsWithState, mapActionWithProps)(Account);
  