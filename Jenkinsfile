pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Install dependencies') {
      steps {
        bat 'npm install'
      }
    }
    stage('Unit checks') {
      steps {
        bat 'npm test'
      }
    }
    stage('Build Docker image') {
      steps {
        bat '"C:\\Users\\dell\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" build -t online-library:latest .'
      }
    }
  }
}