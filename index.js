const core = require('@actions/core')
const { execSync } = require('child_process')

// Support Functions
const createCatFile = ({ email, api_key }) => `cat >~/.netrc <<EOF
machine api.heroku.com
    login ${email}
    password ${api_key}
machine git.heroku.com
    login ${email}
    password ${api_key}
EOF`

// Input Variables
let heroku = {}
heroku.api_key = core.getInput('heroku_api_key')
heroku.email = core.getInput('heroku_email')
heroku.app_name = core.getInput('heroku_app_name')
let command = core.getInput('command')

// Program logic
try {
  execSync(createCatFile(heroku))
  console.log('Created and wrote to ~./netrc')

  execSync('heroku login')
  console.log('Successfully logged into heroku')

  execSync(`heroku ${command}` -a ${heroku.app_name}`)

  core.setOutput(
    'status',
    `Successfully ran command ${command} in ${heroku.app_name}`,
  )
} catch (err) {
  core.setFailed(err.toString())
}
