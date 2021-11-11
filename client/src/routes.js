import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {LinksPage} from './pages/LinksPage'
import {CreatePage} from './pages/CreatePage'
import {DetailPage} from './pages/DetailPage'
import {AuthPage} from './pages/AuthPage'
import { PostPage } from './pages/PostPage'


export const useRoutes = isAuthenticated => {
    if(isAuthenticated){
        return(
            <Switch>
                <Route path="/posts" exact>
                    <PostPage/>
                </Route>
                <Route path="/links" exact>
                    <LinksPage/>
                </Route>
                <Route path="/create" exact>
                    <CreatePage/>
                </Route>
                <Route path="/detail/:id">
                    <DetailPage/>
                </Route>
                <Redirect to="/create"/>

            </Switch>
        )
    }
    return(
        <Switch>
            <Route path="/" exact>
                <AuthPage/>

            </Route>
            <Redirect to="/" />

        </Switch>
    )
}