import { FRONTEND_URL, BACKEND_URL } from "../config.js";

if(!localStorage.getItem("token")) {
    window.location.href = "./login.html";
}

function createStructure(data, container, status) {
    data = data.data ;

    for (let i = 0; i < data.length; i++) {
    console.log(data[i]);

    const colDiv = document.createElement("div");
    colDiv.className = "col-12 col-sm-6 col-md-4 col-lg-3 mt-2";

    colDiv.innerHTML = `
        <div class="card">
            <h1 class="card-title ${status ? 'bg-primary' : 'bg-secondary'} text-white rounded">${data[i].title}</h1>
            <div class="card-body">
                <p>Duration: ${data[i].timeDuration} </p>

                <div class="row justify-content-center">
                    <div class="d-flex justify-content-center col-12 col-lg-6 mt-3">
                        <button class="btn btn-warning statusButtons statisticsButton" onclick="openStatisticsModal('${data[i]._id}')" id=${data[i]._id}>View Statistics</button>    
                    </div>

                    <div class="d-flex justify-content-center col-12 col-lg-6 mt-3">
                        <button class="btn ${status ? 'btn-secondary' : 'btn-primary'} statusChangingButton" id=${data[i]._id}>${status ? 'Disable' : 'Enable'} Test</button>    
                    </div>

                    <div class="d-flex justify-content-center col-12 col-lg-12 mt-3">
                        <button class="btn btn-danger statusButtons deleteButton" id=${data[i]._id}>Delete Test</button>
                    </div>

                    <div class="modal fade" id="statisticsModal" tabindex="-1" aria-labelledby="statisticsModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-xl">
                            <div class="modal-content" style="height: 90vh;">
                                <div class="modal-header bg-warning">
                                    <h5 class="modal-title fw-bold" id="statisticsModalLabel">Test Statistics</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body p-0" style="height: calc(100% - 56px);">
                                    <!-- Load statistics page dynamically -->
                                    <iframe id="statisticsIframe" style="width:100%; height:100%; border:0;"></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
        
                </div>
            </div>
        </div>
    `;
    container.appendChild(colDiv) ;
}}

document.addEventListener("DOMContentLoaded", async () => {
    fetch(`${BACKEND_URL}/api/admin/getOngoingTests`)
    .then(response => response.json())
    .then(data => {
        // alert("Got the data successfully");
        console.log(data) ;
        const container = document.getElementById("ongoingExamContainer");
        let colDiv = createStructure(data, container, true) ; 
        // container.appendChild(colDiv);
    })
    .catch(error => {
        window.location.href = "./ISE.html" ;
    });

    fetch(`${BACKEND_URL}/api/admin/getDisabledTests`)
    .then(response => response.json())
    .then(data => {
        // alert("Got the data successfully");
        console.log(data) ;
        const container = document.getElementById("expiredExamContainer");
        let colDiv = createStructure(data, container, false) ;
        // container.appendChild(colDiv);
    })
    .catch(error => {
        window.location.href = "./ISE.html";
    });

    function getStatus(id) {
        // Set iframe src dynamically with the selected testId
        const iframe = document.getElementById("statisticsIframe");
        iframe.src = `testStatistics.html?testId=${id}`;

        // Show modal after setting iframe src
        const statisticsModal = new bootstrap.Modal(document.getElementById("statisticsModal"));
        statisticsModal.show();
    }

/*     function getStatus(id) {
        fetch(`${BACKEND_URL}/api/admin/testAnalysis/${id}`)
        .then(response => {
            if(response.status != 200) {
                alert("Internal Server Error!! try later")
                error() ;
            }
            return response.json() ;
        })
        .then(data => {
            console.log("recieving the data") ;
            console.log(data) ;
        })
        .catch(error => {
            alert("failed to load the test analysis") ;
        })
    } */

    function deleteTest(id) {
        fetch(`${BACKEND_URL}/api/admin/deleteTest/${id}`)
        .then(response => {
            if(response.status != 200) {
                alert("Internal Server Error!! try later") // why im i getting this error
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

    // Delegate clicks from ongoingExamContainer
    document.getElementById("ongoingExamContainer").addEventListener("click", function (e) {
        if (e.target && e.target.classList.contains("statusChangingButton")) {
            fetch(`${BACKEND_URL}/api/admin/disableTest/${e.target.id}`)
            .then(response => {
                if(response.status != 200) {
                    alert("Internal Server Error!! try later")
                    error() ;
                }
                response.json() ;
            })
            .then(data => {
                location.reload() ;
            })
            .catch(error => {
                alert("failed to disable the test") ;
            })
        }
        if(e.target && e.target.classList.contains("statisticsButton")) {
            getStatus(e.target.id) ;
        }
        if(e.target && e.target.classList.contains("deleteButton")) {
            const confirmDelete = confirm("Are you sure you want to delete this test?");
            if (confirmDelete) {
                deleteTest(e.target.id);
            }
        }
    });

    // Delegate clicks from expiredExamContainer
    document.getElementById("expiredExamContainer").addEventListener("click", function (e) {
        if (e.target && e.target.classList.contains("statusChangingButton")) {
            fetch(`${BACKEND_URL}/api/admin/enableTest/${e.target.id}`)
            .then(response => {
                if(response.status != 200) {
                    alert("Internal Server Error!! try later")
                }
                response.json() ;
            })
            .then(data => {
                location.reload() ;
            })
        }
        if(e.target && e.target.classList.contains("statisticsButton")) {
            getStatus(e.target.id) ;
        }
        if(e.target && e.target.classList.contains("deleteButton")) {
            const confirmDelete = confirm("Are you sure you want to delete this test?");
            if (confirmDelete) {
                deleteTest(e.target.id);
            }
        }
    });
});
