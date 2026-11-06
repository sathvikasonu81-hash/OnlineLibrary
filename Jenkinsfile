pipeline {
  agent any
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Install dependencies') { steps { bat 'npm install' } }
    stage('Unit checks') { steps { bat 'npm test' } }
    stage('Build Docker image') { steps { bat 'docker build -t online-library:latest .' } }
  }
}
