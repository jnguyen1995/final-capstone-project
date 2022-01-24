import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import CreateEditReservations from "../reservations/CreateEditReservations";
import CreateTables from "../tables/CreateTables";
import ReserveSeats from "../reservations/ReserveSeats";
import Search from "../search/Search";
//<Route exact={true} path="/reservations/new">
//<CreateEditReservations />
//</Route>

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <CreateEditReservations />
      </Route>
      <Route exact={true} path="/reservations/:reservationId/edit">
        <CreateEditReservations />
      </Route>
      <Route exact={true} path="/reservations/:reservationId/seat">
        <ReserveSeats />
      </Route>
      <Route exact={true} path="/tables/new">
        <CreateTables />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
