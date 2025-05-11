# Computer-Based Testing Platform

A modern, feature-rich online examination system built with Next.js, Prisma, and TypeScript.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Administration](#administration)
- [Project Structure](#project-structure)
- [Technical Details](#technical-details)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Overview

This Computer-Based Testing (CBT) platform provides an intuitive interface for students to take practice tests and for administrators to create, manage, and analyze test results. The system supports both objective (multiple-choice) and theory-based assessments with features like offline support, year-based filtering, and comprehensive analytics.

## Features

### Test Types
- **Objective Tests**: Multiple-choice questions with automated scoring
- **Theory Tests**: Open-ended questions requiring written responses
- **Mixed Format**: Combine both question types in a single assessment

### Smart Filtering & Organization
- **Year-Based Filtering**: Questions filtered by academic year
- **Topic-Based Filtering**: Focus practice on specific subject areas
- **Question Grouping**: Questions grouped by year in admin interface

### User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Offline Support**: Take tests even with intermittent connectivity
- **Local Caching**: Test data cached for improved performance
- **Progress Tracking**: Visual indicators of test progress
- **Question Flagging**: Mark questions for later review
- **Timed Tests**: Option for time-boxed or unlimited duration tests

### Admin Capabilities
- **Test Creation**: Intuitive interface for creating tests
- **Question Management**: Add, edit, and organize questions by year
- **Rich Content**: Support for images and formatted text in questions
- **Analytics**: Track student performance and identify learning gaps

## Getting Started

### Prerequisites
- Node.js 16.x or higher
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cbt.git
cd cbt
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
