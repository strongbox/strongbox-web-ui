@Library('jenkins-shared-libraries') _

def ARTIFACT_ID = 'strongbox-web-ui'
def SERVER_ID  = 'carlspring-oss-snapshots'
def DEPLOY_SERVER_URL = 'https://repo.carlspring.org/content/repositories/carlspring-oss-snapshots/'
def PR_SERVER_URL = 'https://repo.carlspring.org/content/repositories/carlspring-oss-pull-requests/'

// Notification settings for "master" and "branch/pr"
def notifyMaster = [notifyAdmins: true, recipients: [culprits(), requestor()]]
def notifyBranch = [recipients: [brokenTestsSuspects(), requestor()]]

pipeline {
    agent {
        node {
            label 'ubuntu:jdk8-mvn-3.5-node-8.11-browsers'
            customWorkspace workspace().getUniqueWorkspacePath()
        }
    }
    parameters {
        booleanParam(defaultValue: true, description: 'Trigger strongbox-webapp? (has no effect on branches/prs)', name: 'TRIGGER_WEBAPP')
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
        stage('Install dependencies')
        {
            steps {
                script {
                    def npmCachePath = workspace().getNPMCachePath()
                    sh "npm config set cache ${npmCachePath}"
                    sh "npm install"
                }
            }
        }
        stage('Build')
        {
            steps {
                sh "npm run ci-build"
            }
        }
        stage('Tests')
        {
            parallel {
                stage('ci-test') {
                    steps {
                        sh "npm run ci-test"
                    }
                }

                stage('ci-e2e') {
                    steps {
                        sh "npm run ci-e2e"
                    }
                }
            }
        }
        stage('Deploy') {
            when {
                expression { (currentBuild.result == null || currentBuild.result == 'SUCCESS') }
            }
            steps {
                script {
                    withMavenPlus(mavenLocalRepo: workspace().getM2LocalRepoPath(), mavenSettingsConfig: 'a5452263-40e5-4d71-a5aa-4fc94a0e6833', publisherStrategy: 'EXPLICIT')
                    {
                        def SERVER_URL;
                        def VERSION_ID;

                        if (BRANCH_NAME == 'master') {
                            echo "Deploying master..."
                            SERVER_URL = DEPLOY_SERVER_URL;
                            VERSION_ID = "1.0-SNAPSHOT"
                        } else {
                            echo "Deploying branch/PR"
                            SERVER_URL = PR_SERVER_URL;
                            if(env.CHANGE_ID) {
                                VERSION_ID = "1.0-${env.CHANGE_ID}-SNAPSHOT"
                            } else {
                                VERSION_ID = "1.0-${BRANCH_NAME}-SNAPSHOT"
                            }
                        }

                        sh "mvn deploy:deploy-file " +
                           " -Dfile=./dist/packaging/strongbox-web-ui.zip " +
                           " -DrepositoryId=" + SERVER_ID +
                           " -Durl=" + SERVER_URL +
                           " -DartifactId=" + ARTIFACT_ID +
                           " -DgroupId=org.carlspring.strongbox" +
                           " -Dpackaging=zip" +
                           " -Dversion=" + VERSION_ID
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
        always {
            junit 'dist/TESTS-*.xml'
        }
        cleanup {
            script {
                workspace().clean()
            }
        }
    }
}
