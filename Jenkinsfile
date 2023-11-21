pipeline {
  agent any
  tools {
    nodejs "node"
  }
  stages {
    stage('Checkout SCM') {
      steps {
        checkout scmGit(branches: [
          [name: '*/master']
        ], extensions: [], userRemoteConfigs: [
          [credentialsId: 'JenkinsGit', url: 'https://github.com/RonnieTJW99/ICT3x03']
        ])
      }
    }
    stage('Run Docker build') {
      steps {
        sh 'docker compose build'
      }
    }

    stage('OWASP DependencyCheck') {
      steps {
        dir('frontend/') {
          sh 'npm install --force'
        }
        dir('backend/') {
          sh 'npm install --force'
        }
				dependencyCheck additionalArguments: '--format HTML --format XML', odcInstallation: 'OWASP Dependency-Check Vulnerabilities'
      }
    }
  }
  post {
      success {
        dependencyCheckPublisher pattern: 'dependency-check-report.xml'
      }
    }
 }
