/* groovylint-disable */
pipeline {
  agent none

  options {
    skipDefaultCheckout()
    disableConcurrentBuilds(abortPrevious: true)
  }

  stages {

    // MR Pipeline
    stage('MR Checks') {
      agent any
      when {
        expression {
          return env.BRANCH_NAME != null && env.BRANCH_NAME.startsWith('MR-') && env.CHANGE_BRANCH != 'uat'
        }
        beforeAgent true
      }
      steps {
        script {
          sh 'rm -rf *'
          checkout([$class: 'GitSCM', branches: [[name: '*/' + env.CHANGE_BRANCH]], userRemoteConfigs: 
            [[url: 'git@gitlab.com:kaleidofin/dashboard-ui.git', credentialsId: 'kfin-jenkins']]])
          dir('kaleidofin-customer-ui') {
            nodejs(nodeJSInstallationName: 'node14') {
              sh(label: 'Npm Install', script: 'npm install')
              sh(label: 'Build', script: 'npm run build')
            }
            nodejs(nodeJSInstallationName: 'node20') {
              sh(
                label: 'Sonar Cloud',
                script: '''
                  export JAVA_HOME=$JAVA_HOME17
                  /DATA/jenkins/tools/hudson.plugins.sonar.SonarRunnerInstallation/SonarQube/bin/sonar-scanner -Dsonar.pullrequest.key=$CHANGE_ID
                '''
              )
            }
          }
        }
      }
    }
    // done MR Pipeline

    // Docker Build
    stage('Docker image build') {
      agent any
      when {
        expression {
          return env.BRANCH_NAME != null && (env.BRANCH_NAME.startsWith('feature/') || env.BRANCH_NAME == 'uat')
        }
        beforeAgent true
      }
      steps {
        script {
          'rm -rf *'
          nodejs(nodeJSInstallationName: 'node14') {
            setupEnvironmentVariables()
            codeCheckoutAndBuild()
            buildDockerImage(env.IMAGE_TAG)
          }
        }
      }
    }
    // end Docker Build

    // Deploy
    stage('Code Deployment') {
      agent {
        label 'built-in'
      }
      when {
        expression {
          return env.BRANCH_NAME != null && (env.BRANCH_NAME.startsWith('feature/') || env.BRANCH_NAME == 'uat')
        }
        beforeAgent true
      }
      steps {
        script {
          if (env.BRANCH_NAME == 'uat') {
            deploy('uat')
          } else {
            deploy('ft15')
          }
        }
      }
    }
    // end Deploy

    // ask for signoff
    stage('SignOff UAT') {
      agent none
      when {
        expression {
          // return env.BRANCH_NAME != null && (['uat'].contains(env.BRANCH_NAME))
          return false
        }
        beforeAgent true
      }
      steps {
        script {
          for (int i = 0; i < 2; i++) {
            input "SignOff ${env.IMAGE_TAG} in uat env? By Clicking proceed, you're approving merge uat into preprod branch and deploy it in preprod env"
          }
        }
      }
    }
    // done ask for signoff

    // merge uat into preprod branch
    stage('Merge uat branch into preprod') {
      agent any
      when {
        expression {
          // return env.BRANCH_NAME != null && (['uat'].contains(env.BRANCH_NAME))
          return false
        }
        beforeAgent true
      }          
      steps {
        script {
          env.TAG_AND_MERGE_WORKSPACE = "${env.WORKSPACE}/tag-and-merge"
          checkoutForUatToPreprodMerge()
          mergeUatToPreprod()
          print "Preprod environmet should be up by next 10 minutes."
        }
      }
    }
    // done merge uat into preprod branch


    // trigger preprod build if change target is preprod or hotfix
    stage('Trigger Release Job') {
      when {
        expression {
          // return env.BRANCH_NAME != null && ['preprod', 'hotfix'].contains(env.BRANCH_NAME)
          return false
        }
        beforeAgent true
      }
      steps {
        script {
          build(
            job: 'cicd-release/dashboard-ui-release',
            parameters: [
              [$class: 'StringParameterValue', name: 'BRANCH_NAME', value: env.BRANCH_NAME]
            ],
            propagate: false,
            wait: false
          )
        }
      }
    }
    // trigger release build if change target is preprod or hotfix
  }

  post {
    always {
      node(null) {
        sh 'rm -rf *'
      }
    }
  }
}

/**
 *
 */
void setupEnvironmentVariables() {
  String imageTag = "${env.BRANCH_NAME}-${env.BUILD_ID}"
  env.JAVA17_HOME = '/usr/lib/jvm/jdk-17'
  env.IMAGE_TAG = imageTag.replaceAll("/", "_").substring(0, Math.min(128, imageTag.length()))
  env.APP_WORKSPACE = "${env.WORKSPACE}/workspace"
  env.DEVOPS_WORKSPACE = "${env.WORKSPACE}/devops-script"
  currentBuild.displayName = "${env.IMAGE_TAG}"
  currentBuild.description = "Release is Based on Branch: ${env.BRANCH_NAME}."
}

/**
 * This method cancels the previous build
 */
void milestonePreviousBuild() {
  int buildNumber = env.BUILD_NUMBER
  if (buildNumber > 1) {
    milestone(buildNumber - 1)
  }
  milestone(buildNumber)
}

/**
 *
 */
void codeCheckoutAndBuild() {
  dir(env.APP_WORKSPACE) {
    checkout([$class: 'GitSCM', branches: [[name: "origin/${env.BRANCH_NAME}"]], userRemoteConfigs: 
      [[url: 'git@gitlab.com:kaleidofin/dashboard-ui.git', credentialsId: 'kfin-jenkins']]])
  }
  dir("${env.APP_WORKSPACE}/kaleidofin-customer-ui") {
    sh(label: 'Print node version', script: 'node -v')
    sh(label: 'npm install', script: 'npm install')
    sh(label: 'Build', script: 'npm run build:uat')
  }
}


/**
 *
 */
void buildDockerImage(image_tag) {
  dir(env.APP_WORKSPACE) {
    sh(
      label: "Building docker image with Tag: ${image_tag}",
      script: """
        echo "Docker build with tag ${image_tag}"
        docker build -t kaleidofin/kal-dashboard-ui:${image_tag} -f pipelines/Dockerfile .
        docker image push kaleidofin/kal-dashboard-ui:${image_tag}
      """
    )
  }
}

/**
 *
 */
void deploy(deployEnv) {
  checkoutDevopsScript()
  sh (
    label: "Deploying to ${deployEnv}. image tag: $IMAGE_TAG",
    script: """
      ansible-playbook -i ${env.DEVOPS_WORKSPACE}/ansible/inventory/${deployEnv}/ \
        ${env.DEVOPS_WORKSPACE}/ansible/deploy/${deployEnv}/kal-dashboard-ui/deploy.yml \
        --vault-password-file /var/lib/jenkins/secrets/vault-pass \
        --extra-vars "env=${deployEnv} business_group=kaleidofin-web \
        image_tag=${env.IMAGE_TAG} ws=${env.DEVOPS_WORKSPACE}"
    """
  )
}

/**
 *
 */
void devDeploy() {
  String envChoices = ''
  for (int i = 1; i <= Integer.parseInt(env.FT_COUNT); i++) {
    envChoices += "ft${i}\n"
  }
  try {
    timeout(time: 90, unit: 'SECONDS') {
      env.FT_ENV = input message: 'Please select an environment to deploy', parameters:
        [choice(choices: envChoices, name: 'askEnvironment', description: 'Ask for deployment')]
      print "${env.FT_ENV} is choosen to deploy ${env.IMAGE_TAG}"
      deploy(env.FT_ENV)
    }
  } catch (e) {
    print "Environment not selected. Ignoring Deployment"
  }
}


/**
 *
 */
void checkoutDevopsScript() {
  dir(env.DEVOPS_WORKSPACE) {
    sh "rm -rf $DEVOPS_WORKSPACE/*"
    checkout([$class: 'GitSCM', branches: [[name: 'origin/development']], userRemoteConfigs: 
      [[url: 'git@gitlab.com:kaleidofin/devops-scripts.git', credentialsId: 'kfin-jenkins']]])
  }
}

/**
 *
 */
void checkoutForUatToPreprodMerge() {
  sh(label: 'Delete Existing workspace', script: "rm -rf $TAG_AND_MERGE_WORKSPACE")
  dir(env.TAG_AND_MERGE_WORKSPACE) {
    checkout([$class: 'GitSCM', userRemoteConfigs: 
      [[url: 'git@gitlab.com:kaleidofin/dashboard-ui.git', credentialsId: 'kfin-jenkins']]])
  }
}

/**
 *
 */
void mergeUatToPreprod() {
  dir(env.TAG_AND_MERGE_WORKSPACE) {
    sh(label: 'Merge uat branch to preprod', script: '''
      #!/bin/bash
      pwd
      git checkout preprod
      git merge origin/uat || (echo "uat to preprod might have conflicts. Please resolve manually and restart from this stage again" && exit 1)
      git push origin preprod
    ''')
    print "uat branch is merged to preprod"
  }
}
