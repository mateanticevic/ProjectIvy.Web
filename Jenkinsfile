pipeline {
    agent {
        label 'worker'
    }
    stages {
        stage('Build') {
            steps {
                script {
                    def package = "custom"
                    currentBuild.displayName = package

                    def image = docker.build('mateanticevic/project-ivy-web', "--build-arg version=custom .")
                }
            }
        }
    }
}
