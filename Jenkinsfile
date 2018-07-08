@Library('jenkins-shared-libraries') _

def SERVER_ID  = 'carlspring-oss-snapshots'
def SERVER_URL = 'https://dev.carlspring.org/nexus/content/repositories/carlspring-oss-snapshots/'

// Notification settings for "master" and "branch/pr"
def notifyMaster = [notifyAdmins: true, recipients: [culprits(), requestor()]]
def notifyBranch = [recipients: [brokenTestsSuspects(), requestor()]]

pipeline {
    agent {
        node {
            label 'alpine:jre8-npm-9.4-ui'
            customWorkspace workspace().getUniqueWorkspacePath()
        }
    }
    parameters {
        booleanParam(defaultValue: true, description: 'Send email notification?', name: 'NOTIFY_EMAIL')
    }
    options {
        timeout(time: 2, unit: 'HOURS')
        disableConcurrentBuilds()
    }
    stages {
        stage('Node')
        {
            steps {
                nodeInfo("npm yarn node mvn")
            }
        }
        stage('NPM install')
        {
            steps {
                sh "npm install"
                sh "npm run webdriver-update"
            }
        }
        stage('Build')
        {
            steps {
                sh "npm run ci-build"
            }
        }
        stage('Test')
        {
            steps {
                sh "npm run ci-test"
                sh "npm run ci-e2e"
            }
        }
        stage('Deploy') {
            when {
                expression { BRANCH_NAME == 'master' && (currentBuild.result == null || currentBuild.result == 'SUCCESS') }
            }
            steps {
                script {
                    withMavenPlus(mavenLocalRepo: workspace().getM2LocalRepoPath(), mavenSettingsConfig: 'a5452263-40e5-4d71-a5aa-4fc94a0e6833', publisherStrategy: 'EXPLICIT')
                    {
                        sh "mvn deploy:deploy-file " +
                           " -Dfile=./dist/packaging/strongbox-web-ui.zip " +
                           " -DrepositoryId=" + SERVER_ID +
                           " -Durl=" + SERVER_URL +
                           " -DartifactId=strongbox-web-ui" +
                           " -DgroupId=org.carlspring.strongbox" +
                           " -Dpackaging=zip "
                    }
                }
            }
        }
    }
    post {
        failure {
            script {
                if(params.NOTIFY_EMAIL) {
                    notifyFailed((BRANCH_NAME == "master") ? notifyMaster : notifyBranch)
                }
            }
        }
        unstable {
            script {
                if(params.NOTIFY_EMAIL) {
                    notifyUnstable((BRANCH_NAME == "master") ? notifyMaster : notifyBranch)
                }
            }
        }
        fixed {
            script {
                if(params.NOTIFY_EMAIL) {
                    notifyFixed((BRANCH_NAME == "master") ? notifyMaster : notifyBranch)
                }
            }
        }
        cleanup {
            script {
                workspace().clean()
            }
        }
    }
}
