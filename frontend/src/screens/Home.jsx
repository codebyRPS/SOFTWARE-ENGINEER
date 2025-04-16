import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/user.context';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { user } = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const fetchProjects = async () => {
        try {
            const res = await axios.get('/projects/all');
            setProjects(res.data.projects);
        } catch (err) {
            setError('Failed to fetch projects.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const createProject = async (e) => {
        e.preventDefault();
        setCreating(true);

        try {
            const res = await axios.post('/projects/create', { name: projectName });
            setProjects([...projects, res.data.project]); // Optimistic update
            setIsModalOpen(false);
            setProjectName('');
        } catch (error) {
            console.error(error);
            setError('Failed to create project.');
        } finally {
            setCreating(false);
        }
    };

    const deleteProject = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await axios.delete(`/projects/delete/${id}`);
            setProjects(projects.filter(project => project._id !== id));
        } catch (error) {
            console.error('Error deleting project:', error); // Logs the error instead of setting state
        }
    };

    return (
        <main className="p-6 bg-gray-900 text-white min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Your Projects</h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                    + New Project
                </button>
            </div>

            {loading ? (
                <p>Loading projects...</p>
            ) : error ? (
                <p className="text-red-400">{error}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {projects.map((project) => (
                        <div 
                            key={project._id}
                            onClick={() => navigate(`/project`, { state: { project } })}
                            className="bg-gray-800 p-4 shadow-lg rounded-lg hover:bg-gray-700 cursor-pointer transition relative"
                        >
                            <h2 className="font-semibold text-lg">{project.name}</h2>
                            <p className="text-sm text-gray-400 flex items-center gap-1">
                                <i className="ri-user-line"></i> Collaborators: {project.users.length}
                            </p>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    deleteProject(project._id);
                                }} 
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                                <i className="ri-delete-bin-6-line"></i>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div 
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={() => setIsModalOpen(false)} // Close modal on outside click
                >
                    <div 
                        className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/3 relative"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
                        <form onSubmit={createProject}>
                            <label className="block text-sm font-medium text-gray-300">Project Name</label>
                            <input
                                onChange={(e) => setProjectName(e.target.value)}
                                value={projectName}
                                type="text"
                                className="mt-1 block w-full p-2 border border-gray-600 rounded-md bg-gray-900 text-white"
                                required
                            />
                            <div className="flex justify-end mt-4">
                                <button 
                                    type="button" 
                                    className="mr-2 px-4 py-2 bg-gray-600 rounded-md text-white hover:bg-gray-700 transition" 
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={creating}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400 hover:bg-blue-700 transition"
                                >
                                    {creating ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Home;
