from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)
    
jira_domain = 'vier-ai.atlassian.net'
jira_username = 'bjoern.osbahr@vier.ai'
api_token = 'ATATT3xFfGF0sI_sH0fXFcDUfYH9bHyi_HCA7k6alt32ypGkqZgWvQDD7aM9zHCioXc9zeo3P8DMSW7wexdWxLxTzU_BGUgpT8sWcaA2wqL2903sCQAp9TADxDDROBshuwDVHE76ofkrt1g1SO3xLDe5mghNAnRZiEfhe7eRrd59_tS4v47Sl-8=92068AD7'
filter_or_jql = 'project = "VUPS" and issuetype = Requirement'

@app.route('/api/issues')
def fetch_jira_issues():
    #url = f'https://{jira_domain}/rest/api/3/search?jql={filter_or_jql}'
    #headers = {
    #    'Authorization': f'Bearer {api_token}',
    #    'Content-Type': 'application/json'
    #}
    #response = requests.get(url, headers=headers)
    #response_data = response.json()

    url = f'https://{jira_domain}/rest/api/3/search?jql={filter_or_jql}'
    auth = (jira_username, api_token)

    response = requests.get(url, auth=auth)
    response_data = response.json()

    # Process the fetched JIRA issues data here

    #return jsonify(response_data)
    return response_data

# Test the function
#issues = fetch_jira_issues()
#print(issues)


if __name__ == '__main__':
    app.run()


