pipeline {
    agent any
    stages {
        stage('build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
                sh 'docker build -t case/wcsbroker .'
                sh 'docker tag case/wcsbroker master.cfc:8500/default/casewcsbroker:v0.01'
                sh 'cd chart; helm package casewcsbroker'
            }
        }
    }
}
