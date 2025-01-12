document.querySelector('.right').addEventListener('click', function (event) {
    if (event.target.closest('.btn-delete')) {
        // Find the task card and get its ID
        const taskCard = event.target.closest('.tasks');
        const taskId = taskCard.querySelector('.tasks-cards').id;

        // Send a DELETE request to the server
        fetch(`/delete/${taskId}`, { method: "DELETE" })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Remove the task from the DOM
                    taskCard.remove();
                    console.log(`Task with ID ${taskId} deleted successfully.`);

                    if(!data.hastask)
                    {
                        const rightcontainer = document.querySelector('.right');
                        rightcontainer.innerHTML = 
                            `
                            <div class="no-tasks-message">
                                <p>No tasks added yet! Start by creating a new task 😎.</p>
                            </div>

                            `;
                    }
                }
            })
            .catch(err => console.error("Error deleting task:", err));
    }
}); 

document.querySelector('.right').addEventListener('click', function (event) {
    if (event.target.closest('.btn-update')) {
        const taskCard = event.target.closest('.tasks');
        const taskId = taskCard.querySelector('.tasks-cards').id;

        const taskName = taskCard.querySelector('h3').textContent;
        const taskDescription = taskCard.querySelector('p').textContent;
        
        const updatedName = prompt("Update Task Name:", taskName);
        const updatedDescription = prompt("Update Task Description:", taskDescription);
        if(updatedName && updatedDescription)
        {
            fetch(`/update/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: updatedName,
                    description: updatedDescription
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update the task in the DOM
                    taskCard.querySelector('h3').textContent = updatedName;
                    taskCard.querySelector('p').textContent = updatedDescription;
                    console.log(`Task with ID ${taskId} updated successfully.`);
                } else {
                    console.log('Failed to update task');
                }
            })
            .catch(err => console.error('Error updating task:', err));
        }
    }
});