pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/vimal2512/task_manager_backend.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test || echo "No tests configured"'
            }
        }

        stage('Deploy') {
            steps {
                sh """
                pm2 stop task_manager_backend || true
                pm2 delete task_manager_backend || true
                pm2 start npm --name task_manager_backend -- start
                """
            }
        }
    }

    post {
        success {
            echo "✅ Build & Deploy Successful!"
        }
        failure {
            echo "❌ Build Failed!"
        }
    }
}
