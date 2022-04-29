import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
// constants
import { BG } from "./constants/images";
import { LOBBY, CHAT } from "./constants/routes";
// pages
import Loading from "./pages/loading/Loading";
const Lobby = lazy(() => import("./pages/lobby/Lobby"));
const Chat = lazy(() => import("./pages/chat/Chat"));


function App() {
  return (
    <Router>
      <img className="app__bg" src={BG} alt="" />
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path={LOBBY} component={Lobby} />
          <Route exact path={CHAT} component={Chat} />
          <Redirect to={LOBBY} />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
