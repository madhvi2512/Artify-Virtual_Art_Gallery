pipeline {
    agent any

    stages {

        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/madhvi2512/Artify-Virtual_Art_Gallery.git'
            }
        }

        stage('Clean Old Containers') {
            steps {
                bat '''
                echo Stopping running containers...
                FOR /f "tokens=*" %%i IN ('docker ps -q') DO docker stop %%i

                echo Removing all containers...
                FOR /f "tokens=*" %%i IN ('docker ps -aq') DO docker rm %%i
                '''
            }
        }

        stage('Build & Deploy') {
            steps {
                bat 'docker-compose up --build -d'
            }
        }

    }
}