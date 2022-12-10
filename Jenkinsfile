def image
def version

pipeline {
    agent {
        label 'worker'
    }
    stages {
        stage('Build') {
            steps {
                script {
                    version = readJSON(file: 'package.json').version
                    currentBuild.displayName = version

                    image = docker.build("mateanticevic/project-ivy-web:${version}")
                }
            }
        }
        stage('Push') {
            when {
                branch 'master'
            }
            steps {
                script {
                    image.push()
                }
            }
        }
    }
}
