pipeline {
    agent {
        label 'worker'
    }
    stages {
        stage('Build') {
            steps {
                script {
                    currentBuild.displayName = 'custom'

                    def image = docker.build('mateanticevic/project-ivy-web', "--build-arg version=custom .")
                }
            }
        }
    }
}
