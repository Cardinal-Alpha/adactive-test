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
import LoginCard from './component/LoginCard';
import RegisterCard from './component/RegisterCard';
import HelloCard  from './component/HelloCard';
import HomeContent from './component/HomeContent';

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
                            <FullViewContainer>
                                <HomeContent />
                            </FullViewContainer>
                        </Route>
                        <Route path="*">
                            <h2>Oops.. not found</h2>
                        </Route>
                        </Switch>
                    </Router>
                </Provider>
    }else{
        return <div>Loading...</div>
    }
}

export default App;