pipeline {
  agent {
    dockerfile {
      filename 'Dockerfile.ci'
      args '-v /etc/group:/etc/group:ro ' +
           '-v /etc/passwd:/etc/passwd:ro ' +
           '-v /var/lib/jenkins:/var/lib/jenkins'
    }
  }

  stages {
    stage('Build') {
      steps {
        sh 'cp -r /node_modules ./'
        sh 'yarn build'
        archiveArtifacts artifacts: 'dist/*', fingerprint: true
      }
    }
  }
}
