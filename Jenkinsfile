pipeline {
    agent {
        label 'worker'
    }
    stages {
        stage('Build') {
            steps {
                script {
                   def package = readJSON file: 'package.json'
                   currentBuild.displayName = package.version
                   
                   def image = docker.build("mateanticevic/project-ivy-web", "--build-arg version=${version} .")
                }
            }
        }
    }
}
