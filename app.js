
// Fetch Data From JIRA
// TODO parametrize API endpoint
const filterOrJQL = 'project = "VUPS" and issuetype = Requirement';
fetch(`http://127.0.0.1:5000/api/issues`)

    .then(response => response.json())
    .then(data => {
        const issuesTable = document.getElementById('jira-issues-table');
    
        data.issues.forEach(issue => {
            const row = document.createElement('tr');
            
            const issueKeyCell = document.createElement('td');
            issueKeyCell.textContent = issue.key;
            row.appendChild(issueKeyCell);
    
            const summaryCell = document.createElement('td');
            summaryCell.textContent = issue.fields.summary;
            row.appendChild(summaryCell);
    
            const statusCell = document.createElement('td');
            statusCell.textContent = issue.fields.status.name;
            row.appendChild(statusCell);
    
            // Add more cells and data as needed
    
            issuesTable.querySelector('tbody').appendChild(row);
        });

        enableDragAndDrop();
        restoreStateFromLocalStorage();
    })
    .catch(error => {
        // Handle any errors that occurred during the request
    });

/*** Drag'n Drop Feature ***/ 
let draggedIssue = null;

function handleDragStart(event) {
    draggedIssue = event.target;
    event.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

function handleDrop(event) {
    event.preventDefault();
    const targetIssue = event.target.parentNode;
    if (targetIssue.tagName === 'TD') {
      const targetRow = targetIssue.parentNode;
      const parentTable = targetRow.parentNode;
  
      parentTable.insertBefore(draggedIssue.parentNode, targetRow); // Insert the dragged row before the target row
      saveStateToLocalStorage(); // Call the function to save state after dropping
    }
  }
  

function enableDragAndDrop() {
    const issueRows = document.querySelectorAll('#jira-issues-table tbody tr');

    issueRows.forEach(row => {
        row.addEventListener('dragstart', handleDragStart);
        row.addEventListener('dragover', handleDragOver);
        row.addEventListener('drop', handleDrop);
        row.setAttribute('draggable', 'true');
    });
}



/*** Persist Order ***/
function saveStateToLocalStorage() {
    const issueRows = document.querySelectorAll('#jira-issues-table tbody tr');
    const issueOrder = Array.from(issueRows).map(row => row.id);
    localStorage.setItem('issueOrder', JSON.stringify(issueOrder));
    localStorage.setItem('currentFilter', filterOrJQL);
}

function restoreStateFromLocalStorage() {
    const issueOrder = JSON.parse(localStorage.getItem('issueOrder'));
    const currentFilter = localStorage.getItem('currentFilter');
    if (issueOrder && currentFilter === filterOrJQL) {
        const issuesTable = document.getElementById('jira-issues-table');
        issueOrder.forEach(issueId => {
            const issueRow = document.getElementById(issueId);
            issuesTable.querySelector('tbody').appendChild(issueRow);
        });
    }
}

let issuesTable = null; // Define the variable outside of the event listener

window.addEventListener('DOMContentLoaded', () => {
  issuesTable = document.getElementById('jira-issues-table'); // Move the assignment inside the event listener

  // Add the event listener after the issuesTable element is available
  issuesTable.addEventListener('dragend', saveStateToLocalStorage);
});