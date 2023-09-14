import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/PublicHome'
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import NotesList from './features/notes/NotesList'
import UsersList from './features/users/UsersList'
import EditUser from './features/users/EditUser'
import NewUserForm from './features/users/NewUserForm'
import EditNote from './features/notes/EditNote'
import NewNote from './features/notes/NewNote'
import Prefetch from './features/auth/Prefetch'
import PersistLogin from './features/auth/PersistLogin'
import RequireAuth from './features/auth/RequireAuth'
import { ROLES } from './config/roles'
import useTitle from './hooks/useTitle'
import ViewNote from './features/notes/ViewNote'
import NewLiftnShift from './features/sows/liftnshift';
import NewArchitectasaService from './features/sows/arcservice';
import ViewSoWs from './features/sows/ViewSoWs';
import EditSoW from './features/sows/EditSoW';
/*import CPQCalcForm from './features/cpq/cpqCalcForm'; */


function App() {
  useTitle('My SOW')

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>

                <Route index element={<Welcome />} />

                <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>

                <Route path="notes">
                  <Route index element={<NotesList />} />
                  <Route path=":id" element={<EditNote />} />
                  <Route path="new" element={<NewNote />} />
                  <Route path="view" element={<ViewNote />} />

                </Route>

                <Route path="sows">
                  <Route index element={<NotesList />} />
                  <Route path="lift-n-shift" element={<NewLiftnShift />} />
                  <Route path="arc-as-service" element={<NewArchitectasaService />} />
                  <Route path="view-sows" element={<ViewSoWs />} />
                  <Route path=":id" element={<EditSoW />} />
                  {/*<Route path="cpq" element={<CPQCalcForm />} /> */}
                </Route>

              </Route>{/* End Dash */}
            </Route>
          </Route>
        </Route>{/* End Protected Routes */}

      </Route>
    </Routes >
  );
}

export default App;