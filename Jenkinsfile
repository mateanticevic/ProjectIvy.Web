pipeline {
    agent {
        label 'worker'
    }
    stages {
        stage('Build') {
            steps {
                script {
                    currentBuild.displayName = readJSON(file: 'package.json').version

                    def image = docker.build('mateanticevic/project-ivy-web', "--build-arg version=custom .")
                }
            }
        }
    }
}
