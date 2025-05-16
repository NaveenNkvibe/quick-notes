import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './route/PrivateRoute';
import Login from './app/auth/Login';
import Register from './app/auth/Register';
import Dashboard from './app/dashboard/Dashboard';
import NoteCreate from './app/notes/CreateUpdateNotes';
import NoteDetailCard from './app/notes/NoteDetails';

const isAuthenticated = () => !!localStorage.getItem('token');

function App() {
	return (
		<div>
			<Routes>
				<Route path="/" element={<Navigate to={isAuthenticated() ? '/dashboard' : '/login'} />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route
					path="/dashboard"
					element={
						<PrivateRoute>
							<Dashboard />
						</PrivateRoute>
					}
				/>
				<Route
					path="/create-note"
					element={
						<PrivateRoute>
							<NoteCreate />
						</PrivateRoute>
					}
				/>
				<Route
					path="/update-note/:id"
					element={
						<PrivateRoute>
							<NoteCreate />
						</PrivateRoute>
					}
				/>
				<Route path="/note/:id" element={<NoteDetailCard />} />
			</Routes>
		</div>
	);
}

export default App;
