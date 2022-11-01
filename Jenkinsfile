pipeline {
    agent {
        label 'worker'
    }
    stages {
        stage('Build') {
            steps {
                script {
                   def version = readJSON(file: 'package.json').version
                   currentBuild.displayName = version

                   def image = docker.build("mateanticevic/project-ivy-web", "--build-arg version=${version} .")
                }
            }
        }
    }
}