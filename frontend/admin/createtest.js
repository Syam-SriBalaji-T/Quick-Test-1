import { FRONTEND_URL, BACKEND_URL } from "../config.js";

if (!localStorage.getItem("token")) {
    window.location.href = "./login.html";
}

function displayData(data) {
    let draftsContainer = document.getElementById("draftsContainer");
    draftsContainer.innerHTML = ""; // Clear previous data before rendering

    for (let i = 0; i < data.length; i++) {
        let element = document.createElement("div");
        element.className = "col-12 col-sm-6 col-md-4 col-lg-3 mt-2";

        // Build sections list
        let sections = "<ul>";
        for (let j = 0; j < data[i].sections.length; j++) {
            sections += `<li>${data[i].sections[j].subject}</li>`;
        }
        sections += "</ul>";

        element.innerHTML = `
            <div class="card">
                <h1 class="card-title bg-secondary text-white rounded">${data[i].title}</h1>
                
                <div class="card-body">
                    <p>Duration: ${data[i].timeDuration} minutes</p>
                    <div>${sections}</div>
                    <div class="row">
                        <div class="col-12 col-md-6 d-grid mt-2 d-flex justify-content-center">
                            <button type="button" class="btn btn-info editButton" id=${data[i]._id} data-bs-toggle="modal" data-bs-target="#editTest">Edit Test</button>
                        </div>
                        <div class="col-12 col-md-6 d-grid mt-2 d-flex justify-content-center">
                            <button type="button" class="btn btn-danger deleteButton" id=${data[i]._id}>Delete Test</button>
                        </div>
                        <div class="col-12 col-md-12 d-grid mt-2 d-flex justify-content-center">
                            <button type="button" class="btn btn-primary editButton" id=${data[i]._id} data-bs-toggle="modal" data-bs-target="#editTest">Launch Test</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        draftsContainer.appendChild(element);
    }
}

// Delete test function
    function deleteTest(id) {
        fetch(`${BACKEND_URL}/api/admin/deleteTest/${id}`)
        .then(response => {
            if(response.status != 200) {
                alert("Internal Server Error!! try later")
                error() ;
            }
            return response.json() ;
        })
        .then(data => {
            console.log("delete the test successfully") ;
            console.log(data) ;
            location.reload() ;
        })
        .catch(error => {
            alert("failed to delete the test") ;
        })
    }
    
/* function deleteTest(id) {
    fetch(`${BACKEND_URL}/api/admin/deleteTest/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
        .then(response => {
            if (response.status !== 200) {
                alert("Internal Server Error!! Try later");
                throw new Error("Failed to delete test");
            }
            return response.json();
        })
        .then(data => {
            console.log("Deleted the test successfully", data);
            alert("Test deleted successfully!");
            location.reload();
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Failed to delete the test");
        });
} */

// Handle edit, delete, and launch buttons using event delegation
document.getElementById("draftsContainer").addEventListener("click", (e) => {
    const target = e.target;

    // Edit test
    if (target.classList.contains("editButton")) {
        window.open(`${BACKEND_URL}/api/admin/editTest/${target.id}`, "_blank");
    }

    // Delete test
    if (target.classList.contains("deleteButton")) {
        const confirmDelete = confirm("Are you sure you want to delete this test?");
        if (confirmDelete) {
            deleteTest(target.id);
        }
    }
});

// Fetch draft tests on page load
document.addEventListener("DOMContentLoaded", async () => {
    fetch(`${BACKEND_URL}/api/admin/getDraftTests`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayData(data.data);
        })
        .catch(error => {
            //console.error(error);
            window.location.href = "./ISE.html";
        });
});


/* import { FRONTEND_URL, BACKEND_URL } from "../config.js";

if(!localStorage.getItem("token")) {
    window.location.href = "./login.html";
}

function displayData(data) {
    let draftsContainer = document.getElementById("draftsContainer") ;
    for(let i=0;i<data.length;i++) {
        let element = document.createElement("div") ;
        element.className = "col-12 col-sm-6 col-md-4 col-lg-3 mt-2" ;
        let sections = "<ul>" ;
        for(let j=0;j<data[i].sections.length;j++) {
            sections += `<li>${data[i].sections[j].subject}</li>` ;
        }
        sections += "</ul>" ;
        console.log(sections) ;
        element.innerHTML = `
            <div class="card">
                <h1 class="card-title bg-secondary text-white rounded">${data[i].title}</h1>
                
                <div class="card-body">
                    <p>Duration: ${data[i].timeDuration} minutes</p>
                    <div>
                        ${sections}
                    </div>
                    <div class="row">
                        <div class="col-12 col-md-6 d-grid mt-2 d-flex justify-content-center">
                            <button type="button" class="btn btn-info editButton" id=${data[i]._id} data-bs-toggle="modal" data-bs-target="#editTest">Edit Test</button>
                        </div>
                        <div class="col-12 col-md-6 d-grid mt-2 d-flex justify-content-center">
                            <button type="button" class="btn btn-danger deleteButton" id=${data[i]._id}>Delete Test</button>
                        </div>
                        <div class="col-12 col-md-12 d-grid mt-2 d-flex justify-content-center">
                            <button type="button" class="btn btn-primary editButton" id=${data[i]._id} data-bs-toggle="modal" data-bs-target="#editTest">Launch Test</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        ` ;
        draftsContainer.appendChild(element) ;
    }
}
    
// integrate deleteButton with this function
    function deleteTest(id) {
        fetch(`${BACKEND_URL}/api/admin/deleteTest/${id}`)
        .then(response => {
            if(response.status != 200) {
                alert("Internal Server Error!! try later")
                error() ;
            }
            return response.json() ;
        })
        .then(data => {
            console.log("delete the test successfully") ;
            console.log(data) ;
            location.reload() ;
        })
        .catch(error => {
            alert("failed to delete the test") ;
        })
    }

document.getElementById("draftsContainer").addEventListener('click', (e) => {
    if(e.target.classList.contains("editButton")) {
        window.open(`${BACKEND_URL}/api/admin/editTest/${e.target.id}`, '_blank');
    }
})

document.addEventListener("DOMContentLoaded", async () => {
    fetch(`${BACKEND_URL}/api/admin/getDraftTests`)
    .then(response => response.json())
    .then(data => {
        console.log(data) ;
        displayData(data.data) ;
    })
    .catch(error => {
        //console.log(error)
        window.location.href = "./ISE.html" ;
    });
}) ; */