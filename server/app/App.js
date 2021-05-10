import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'
import {AuthContext} from "./context"
import {AuthStore} from "./store"
import {Provider} from "react-redux"

import FullViewContainer from "./component/FullViewContainer";
import DashboardContainer from "./component/DashboardContainer";
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
                    <Router>
                        <Switch>
                        <Route exact path="/">
                            <FullViewContainer>
                                <LoginCard />
                            </FullViewContainer>
                        </Route>
                        <Route exact path='/register/hello'>
                            <FullViewContainer>
                                <HelloCard />
                            </FullViewContainer>
                        </Route>
                        <Route exact path='/register'>
                            <FullViewContainer>
                                <RegisterCard />
                            </FullViewContainer>
                        </Route>
                        <Route exact path='/dashboard'>
                            <DashboardContainer>
                                <HomeContent />
                            </DashboardContainer>
                        </Route>
                        <Route exact path='/profile'>
                            <DashboardContainer>
                                <ProfileContent />
                            </DashboardContainer>
                        </Route>
                        <Route exact path='/inventory/storage'>
                            <DashboardContainer>
                                <StorageContent />
                            </DashboardContainer>
                        </Route>
                        <Route exact path='/inventory/checkin'>
                            <DashboardContainer>
                                <CheckInContent />
                            </DashboardContainer>
                        </Route>
                        <Route exact path='/inventory/checkout'>
                            <DashboardContainer>
                                <CheckOutContent />
                            </DashboardContainer>
                        </Route>
                        <Route path="*">
                            <DashboardContainer>
                                <h2>Oops.. not found</h2>
                            </DashboardContainer>
                        </Route>
                        </Switch>
                    </Router>
                </Provider>
    }else{
        return <div>Loading...</div>
    }
}

export default App;