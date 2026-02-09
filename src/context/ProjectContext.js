import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { databases, storage } from '../lib/appwrite';
import { ID, Query } from 'appwrite';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

export const useProject = () => {
    return useContext(ProjectContext);
};

export const ProjectProvider = ({ children }) => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [currentProject, setCurrentProject] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const DATABASE_ID = process.env.REACT_APP_APPWRITE_DATABASE_ID;
    const COLLECTION_ID = process.env.REACT_APP_APPWRITE_COLLECTION_ID;
    const BUCKET_ID = process.env.REACT_APP_APPWRITE_BUCKET_ID;

    const fetchProjects = useCallback(async () => {
        if (!user) {
            setProjects([]);
            return;
        }

        setLoading(true);
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [Query.equal('ownerId', user.$id), Query.orderDesc('$createdAt')]
            );
            setProjects(response.documents);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user, DATABASE_ID, COLLECTION_ID]);

    useEffect(() => {
        if (user) {
            fetchProjects();
        }
    }, [user, fetchProjects]);

    const saveProject = async (projectData, name, thumbnailBlob = null) => {
        if (!user) throw new Error('User must be logged in to save projects');

        setLoading(true);
        setError(null);

        try {
            // 1. Create JSON file from project data
            const jsonString = JSON.stringify(projectData);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const file = new File([blob], 'project.json');

            // 2. Upload file to Bucket
            const fileUpload = await storage.createFile(
                BUCKET_ID,
                ID.unique(),
                file
            );

            // 3. Upload thumbnail if provided (Optional - for future use)
            let thumbnailId = null;
            if (thumbnailBlob) {
                const thumbFile = new File([thumbnailBlob], 'thumbnail.png');
                const thumbUpload = await storage.createFile(
                    BUCKET_ID,
                    ID.unique(),
                    thumbFile
                );
                thumbnailId = thumbUpload.$id;
            }

            // 4. Create Document in Database
            const document = await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    name,
                    fileId: fileUpload.$id,
                    ownerId: user.$id,
                    thumbnailId: thumbnailId
                }
            );

            // 5. Update local state
            setProjects(prev => [document, ...prev]);
            setCurrentProject({ ...projectData, id: document.$id, name });

            return document;
        } catch (err) {
            console.error('Error saving project:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateProject = async (projectId, projectData, name) => {
        if (!user) throw new Error('User must be logged in to update projects');

        setLoading(true);
        setError(null);

        try {
            // Get existing project to find old file ID
            const existingDoc = projects.find(p => p.$id === projectId);
            if (!existingDoc) throw new Error('Project not found');

            // 1. Delete old file
            if (existingDoc.fileId) {
                await storage.deleteFile(BUCKET_ID, existingDoc.fileId);
            }

            // 2. Upload new file
            const jsonString = JSON.stringify(projectData);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const file = new File([blob], 'project.json');

            const fileUpload = await storage.createFile(
                BUCKET_ID,
                ID.unique(),
                file
            );

            // 3. Update Document
            const updatedDoc = await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                projectId,
                {
                    name,
                    fileId: fileUpload.$id
                }
            );

            // 4. Update local state
            setProjects(prev => prev.map(p => p.$id === projectId ? updatedDoc : p));
            setCurrentProject({ ...projectData, id: projectId, name });

            return updatedDoc;
        } catch (err) {
            console.error('Error updating project:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const loadProject = async (projectId) => {
        setLoading(true);
        setError(null);
        try {
            // 1. Get Document
            const document = await databases.getDocument(
                DATABASE_ID,
                COLLECTION_ID,
                projectId
            );

            // 2. Get File View (Download)

            // Appwrite getFileView returns a URL. We need to fetch the content.
            // However, getFileView returns an image preview usually. 
            // For JSON data, we should use getFileDownload.

            const downloadUrl = storage.getFileDownload(BUCKET_ID, document.fileId);

            const response = await fetch(downloadUrl);
            if (!response.ok) throw new Error('Failed to download project file');

            const projectData = await response.json();

            setCurrentProject({ ...projectData, id: document.$id, name: document.name });
            return projectData;
        } catch (err) {
            console.error('Error loading project:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteProject = async (projectId) => {
        setLoading(true);
        try {
            const project = projects.find(p => p.$id === projectId);
            if (project && project.fileId) {
                await storage.deleteFile(BUCKET_ID, project.fileId);
            }
            if (project && project.thumbnailId) {
                await storage.deleteFile(BUCKET_ID, project.thumbnailId);
            }

            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, projectId);
            setProjects(prev => prev.filter(p => p.$id !== projectId));
            if (currentProject && currentProject.id === projectId) {
                setCurrentProject(null);
            }
        } catch (err) {
            console.error('Error deleting project:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        projects,
        currentProject,
        loading,
        error,
        fetchProjects,
        saveProject,
        updateProject,
        loadProject,
        deleteProject,
        setCurrentProject
    };

    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    );
};

export default ProjectContext;
