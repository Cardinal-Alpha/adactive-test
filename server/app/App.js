import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'
import {AuthContext, AppContext} from "./context"
import {AuthStore, AppStore} from "./store"
import {Provider} from "react-redux"

import AppContainer from "./component/AppContainer";
import LoginCard from './component/LoginCard';
import RegisterCard from './component/RegisterCard';
import HelloCard  from './component/HelloCard';

import HomeContent from './component/content/HomeContent';
import ProfileContent from './component/content/ProfileContent';
import StorageContent from './component/content/StorageContent';
import CheckInContent from './component/content/CheckInContent';
import CheckOutContent from './component/content/CheckOutContent';



const App = (props)=>{

    if(typeof window != 'undefined'){

        return <Provider store={AuthStore} context={AuthContext}>
                <Provider store={AppStore} context={AppContext}>
                    <Router>
                        <AppContainer >
                            <Switch>
                                <Route exact path="/">
                                    <LoginCard />
                                </Route>
                                <Route exact path='/register/hello'>
                                    <HelloCard />
                                </Route>
                                <Route exact path='/register'>
                                    <RegisterCard />
                                </Route>
                                <Route exact path='/dashboard'>
                                    <HomeContent />
                                </Route>
                                <Route exact path='/profile'>
                                    <ProfileContent />
                                </Route>
                                <Route exact path='/inventory/storage'>
                                    <StorageContent />
                                </Route>
                                <Route exact path='/inventory/checkin'>
                                    <CheckInContent />
                                </Route>
                                <Route exact path='/inventory/checkout'>
                                    <CheckOutContent />
                                </Route>
                                <Route path="*">
                                    <h2>Oops.. not found</h2>
                                </Route>
                            </Switch>
                        </AppContainer>
                    </Router>
                </Provider>
                </Provider>
    }else{
        return <div>Loading...</div>
    }
}

export default App;