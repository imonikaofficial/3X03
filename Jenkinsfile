pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/imonikaofficial/3X03.git'
            }
        }
        
        stage('Code Quality Check via SonarQube') {
            steps {
                script {
                    def scannerHome = tool 'SonarQube'
                    withSonarQubeEnv('SonarQube') {
                        sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=3X03  -Dsonar.sources=. -Dsonar.host.url=http://172.26.51.22:9000/  -Dsonar.token=sqp_c2bf51886f3fddb925fa93f9e94a01b5d64e61b2"
                    }
                }
            }
        }
    }

    post {
        always {
            recordIssues enabledForFailure: true, tool: sonarQube()
        }
    }
}
