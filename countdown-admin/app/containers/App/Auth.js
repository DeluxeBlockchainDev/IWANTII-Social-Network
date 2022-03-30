import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFound from 'containers/Pages/Standalone/NotFoundDedicated';
import Outer from '../Templates/Outer';
import { Login, Register } from '../pageListAsync';

function Auth() {
  return (
    <Outer>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route component={NotFound} />
      </Switch>
    </Outer>
  );
}

export default Auth;
