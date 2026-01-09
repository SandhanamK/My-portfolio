import React, { useState, useEffect } from 'react';
import './GitHubProjects.css';
import { FaGithub, FaStar, FaCodeBranch, FaExternalLinkAlt } from 'react-icons/fa';

// Hardcoded GitHub username
const GITHUB_USERNAME = 'SandhanamK';

// Project deployment URLs
// Project deployment URLs - these must match the exact repository names from GitHub
const PROJECT_DEPLOYMENTS = {
  'My-Portfolio': 'https://sandhanam-portfolio.netlify.app/',
  'crypto-tracker': 'https://sandhanamk.github.io/crypto-tracker/',
  'E-commerce-Website': 'https://sandhanamk.github.io/E-commerce-Website/'
  // Add more project deployments as needed
  // Format: 'repository-name': 'deployment-url'
};

const GitHubProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGitHubProjects = async () => {
      try {
        // Using GitHub REST API to fetch user's public repositories
        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`
        );

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const repos = await response.json();

        // Log repository names to help with debugging
        console.log('GitHub Repositories:', repos.map(repo => repo.name));

        // Map the repository data to our project format
        const formattedProjects = repos.map(repo => ({
          name: repo.name,
          description: repo.description || 'No description provided',
          html_url: repo.html_url,
          deployment_url: PROJECT_DEPLOYMENTS[repo.name] || null,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          topics: repo.topics || [],
          fork: repo.fork
        }));

        setProjects(formattedProjects);
      } catch (err) {
        console.error('Error fetching GitHub projects:', err);
        setError('Failed to load projects. ' + (err.message || 'Please try again later.'));
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubProjects();
  }, []);


  return (
    <div className="github-projects">
      <div className="projects-grid">
        {loading && (
          <div className="loading">Loading projects from GitHub...</div>
        )}

        {error && (
          <div className="error">{error}</div>
        )}

        {!loading && !error && projects.map((project, index) => (
          <div key={index} className="project-card">
            <div className="project-header">
              <a
                href={project.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
              >
                <FaGithub className="github-icon" />
                {project.name}
              </a>
              {project.fork && <span className="fork-badge">Fork</span>}
            </div>

            <p className="project-description">
              {project.description}
            </p>

            {project.topics && project.topics.length > 0 && (
              <div className="project-topics">
                {project.topics.slice(0, 3).map((topic, i) => (
                  <span key={i} className="topic-tag">{topic}</span>
                ))}
              </div>
            )}

            <div className="project-actions">
              {project.deployment_url ? (
                <a
                  href={project.deployment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="live-app-btn"
                >
                  <FaExternalLinkAlt className="live-app-icon" />
                  Live App
                </a>
              ) : (
                <span className="no-demo">No demo available</span>
              )}
            </div>

            <div className="project-footer">
              <div className="project-stats">
                <span className="stars">
                  <FaStar /> {project.stargazers_count}
                </span>
                <span className="forks">
                  <FaCodeBranch /> {project.forks_count}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default GitHubProjects;