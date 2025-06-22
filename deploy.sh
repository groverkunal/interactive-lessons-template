#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting deployment...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js is not installed. Please install Node.js and try again.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}npm is not installed. Please install npm and try again.${NC}"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

# Run build
echo -e "${YELLOW}Building project...${NC}"
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Build failed. Please fix the errors and try again.${NC}"
    exit 1
fi

# Check if git is installed
if command -v git &> /dev/null; then
    # Check if this is a git repository
    if [ -d ".git" ]; then
        echo -e "${YELLOW}Committing build files to git...${NC}"
        git add .
        git commit -m "Build: Update build files"
        
        # Check if there's a remote repository
        if git remote -v | grep -q "origin"; then
            echo -e "${YELLOW}Pushing changes to remote repository...${NC}"
            git push origin main
        else
            echo -e "${YELLOW}No remote repository found. Skipping push.${NC}"
        fi
    else
        echo -e "${YELLOW}Not a git repository. Skipping git operations.${NC}"
    fi
else
    echo -e "${YELLOW}Git is not installed. Skipping git operations.${NC}"
fi

# Check if Netlify CLI is installed
if command -v netlify &> /dev/null; then
    echo -e "${YELLOW}Deploying to Netlify...${NC}"
    netlify deploy --prod
else
    echo -e "${YELLOW}Netlify CLI is not installed. Skipping Netlify deployment.${NC}"
    echo -e "${YELLOW}To deploy to Netlify, install the Netlify CLI: npm install -g netlify-cli${NC}"
fi

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
