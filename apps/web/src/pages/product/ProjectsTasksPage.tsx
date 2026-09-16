import React from 'react';
import { ProjectsPage } from './ProjectsPage';

/**
 * Legacy route component for /product/projects-tasks
 * Redirects functionally to the canonical /product/projects
 */
export const ProjectsTasksPage: React.FC = () => {
  return <ProjectsPage />;
};
