pipeline {
    agent any
    environment {
        GOOGLE_PROJECT_ID = 'ramp-up-247818';
        GOOGLE_SERVICE_ACCOUNT_KEY = credentials('JENKINS_SERVICE_ACCOUNT');
        HOME = '.'
    }
   
    stages {
        stage('build') {
            steps {
                sh 'npm install'
            }
        }
        stage('test') {
            steps {
                sh 'npm test'
            }
        }
        stage('deploy') {
            steps {
                sh 'echo ------------------setting up google cloud ------------------'
                 sh """
        	        #!/bin/bash
        	        curl -o /tmp/google-cloud-sdk.tar.gz https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-231.0.0-linux-x86_64.tar.gz;
                    tar -xvf /tmp/google-cloud-sdk.tar.gz -C /tmp/;
		            /tmp/google-cloud-sdk/install.sh -q;
                    source /tmp/google-cloud-sdk/path.bash.inc;
			        gcloud config set project ${GOOGLE_PROJECT_ID};
			        gcloud components install kubectl;
			        gcloud auth activate-service-account --key-file ${GOOGLE_SERVICE_ACCOUNT_KEY};
                    """
                sh 'echo -------------------Account configured ------------------'
                sh '/usr/bin/curl -o /tmp/front-dockerfile/dockerfile https://raw.githubusercontent.com/Danielperga97/myDevopsRampUp/develop/containers/backend/dockerfile'
                sh "docker build -t gcr.io/ramp-up-247818/movie-analyst-ui:${env.BUILD_NUMBER} /tmp/front-dockerfile/"
                sh "docker tag gcr.io/ramp-up-247818/movie-analyst-ui:${BUILD_NUMBER} gcr.io/ramp-up-247818/movie-analyst-ui:latest"
                sh "gcloud docker -- push  gcr.io/ramp-up-247818/movie-analyst-ui:${BUILD_NUMBER}"
                sh 'gcloud docker -- push  gcr.io/ramp-up-247818/movie-analyst-ui:latest'
                sh "docker rmi  gcr.io/ramp-up-247818/movie-analyst-ui:${BUILD_NUMBER}"
                sh 'docker rmi  gcr.io/ramp-up-247818/movie-analyst-ui:latest'
                sh  """   
                #!/bin/bash 
                gcloud container clusters get-credentials gke-cluster-ea11e6b4 --zone us-east1-b;
                kubectl set image deployment.apps/movie-analyst-ui movie-analyst-ui=gcr.io/ramp-up-247818/movie-analyst-ui:latest;
                """
            }
        }
    }
}

