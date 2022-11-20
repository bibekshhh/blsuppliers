window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus(event) {
    console.log((navigator.onLine ? "online" : "offline"))
}

//refernceing database
const db = firebase.firestore();

document.querySelector('.contact-form').addEventListener("submit", myFunction);

let editStatus = false;
let id = '';

const saveDetails = (name, amount, date, enddate, rate) =>
    db.collection('users').doc().set({
        name,
        amount,
        date,
        enddate,
        rate,
    });

const getDetails = () => db.collection('users').get();
const onGetDetails = (callback) => db.collection('users').onSnapshot(callback);
const editLoad = (id) => db.collection('users').doc(id).get();
const deleteDetails = id => db.collection('users').doc(id).delete();
const editDetails = (id, updated) => db.collection('users').doc(id).update(updated);

const alert = document.querySelector('.alert-del');

window.addEventListener("DOMContentLoaded", async(e) => {
            onGetDetails((snapshot) => {
                        var body = document.querySelector("#tbody1");
                        body.innerHTML = "";
                        var notification = document.querySelector('.toast-container');
                        notification.innerHTML = "";

                        snapshot.forEach(doc => {
                                    const task = doc.data();
                                    task.id = doc.id;

                                    var amount = task.amount;
                                    var date = task.date;
                                    var enddate = task.enddate;
                                    var name = task.name;
                                    var rate = task.rate;

                                    var date1 = new Date();
                                    var date2 = new Date(date);
                                    var date3 = new Date(enddate);

                                    var date_difference = date3.getTime() - date2.getTime();

                                    var nmonths = date_difference / (1000 * 3600 * 24 * 30);
                                    var ndays = Math.round(date_difference / (1000 * 3600 * 24));
                                    var calcInt = ((amount * rate * nmonths) / 100).toFixed(0);
                                    //console.log(calcInt);

                                    var time_difference = date1.getTime() - date2.getTime();

                                    var months = time_difference / (1000 * 3600 * 24 * 30);
                                    const float = Math.round(time_difference / (1000 * 3600 * 24));
                                    const num = (((amount * rate * months) / 100).toFixed(0));

                                    const parse = JSON.parse(num);
                                    const fint = JSON.parse(calcInt);

                                    var days_left = date1.getTime() - date3.getTime();
                                    const num_days = Math.round(days_left / (1000 * 3600 * 24));
                                    //  if(Math.abs(num_days) < 7 && parse < calcInt){
                                    //  console.log(Math.abs(num_days));}
                                    const parseb = JSON.parse(amount);

                                    arrayB(parse, name, fint);
                                    arrayP(parse, name);

                                    async function loan_fin() {
                                        var table = document.getElementById("table-menu");
                                        var princ_sumVal = 0;
                                        var dueInt_sumVal = 0;
                                        var finInt_sumVal = 0;

                                        for (var i = 1; i < table.rows.length; i++) {
                                            princ_sumVal = princ_sumVal + parseInt(table.rows[i].cells[1].innerHTML);
                                            var dueIntTxt = JSON.stringify(table.rows[i].cells[6].innerHTML);
                                            var due_int = dueIntTxt.match(/\d/g);
                                            due_int = parseInt(due_int.join(""));

                                            var finIntTxt = JSON.stringify(table.rows[i].cells[7].innerHTML);
                                            var fin_int = finIntTxt.match(/\d/g);
                                            fin_int = parseInt(fin_int.join(""));

                                            dueInt_sumVal = dueInt_sumVal + due_int;
                                            finInt_sumVal = finInt_sumVal + fin_int;
                                        }

                                        document.querySelector('.loan_principal_amount').innerHTML = "रु " + princ_sumVal.toLocaleString();
                                        document.querySelector('.loan_dueInt_amount').innerHTML = "रु " + dueInt_sumVal.toLocaleString();
                                        document.querySelector('.loan_finInt_amount').innerHTML = "रु " + finInt_sumVal.toLocaleString();
                                    }

                                    setInterval(loan_fin, 1000);

                                    var body = document.querySelector("#tbody1");
                                    body.innerHTML += `<tr>
  <td id="alert-red">${name}</td>
  <td>${amount}</td>
  ${(parse > calcInt) ? `<td><button class="btn btn-outline-danger btn-unpaid shadow-none" title="Unpaid amount">Unpaid</button></td>`
  : (Math.abs(num_days) <= 7 && parse < calcInt) ? `<td><button class="btn btn-outline-warning btn-warn shadow-none" title="${Math.abs(num_days)} days left">${Math.abs(num_days)} days</button></td>`
  :`<td><button class="btn btn-outline-info btn-pending shadow-none" title="Pending amount">Pending</button></td>`}
  <td>${rate}</td>
  <td>${date}</td>
  <td>${enddate}</td>
  <td>रु ${num}</td>
  <td>रु ${calcInt}</td>
  <td>${ndays}</td>
  <td class="action">
   <i class="bi bi-pencil btn btn-white edit-btn shadow-sm py-1" data-id="${task.id}" title="Edit details"></i>
   <i class="bi bi-trash btn btn-white me-2 shadow-sm py-1 m-1" data-bs-toggle="modal" data-bs-target="#staticBackdrop${task.id}" title="Delete invoice"></i>
  <div class="modal fade loan_modal-box" id="staticBackdrop${task.id}" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Delete Data</h5>
          <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal">&times;</button>
        </div>
     <div class="modal-body p-4 px-3" style="text-align: left;">Are you sure you want to delete the data for ${name}?</div>
<div class="modal-footer p-2">
  <button type="button" class="btn btn-secondary btn-gradient shadow-sm" data-bs-dismiss="modal">Close</button>
  <button type="button" class="btn btn-danger delete-final shadow-none" data-id="${task.id}" data-bs-dismiss="modal">Delete</button>
</div>
</div>
</div>
</div>
  </td>
  </tr>`;


function tableAdd(){
  $('table.dataTable').DataTable({
    lengthChange: false,
    pageLength: 8,
    processing: true,
   responsive: true,
    "scrollX": false,
  "scrollCollapse": true,
  "paging": true,
    searchPanes: {
      show: true
    },
    dom: 'Bfrtip',
     buttons: [
      {
        extend: 'copyHtml5',
        className: 'btn border shadow-sm mt-2',
        text: '<i class="far fa-copy"></i> Copy',
        exportOptions: {
            columns: [ 0, 1, 2, 3, 4, 5, 6, 7 ]
        },
        split: [{
          extend: 'excelHtml5',
          className: 'btn border shadow-sm',
          text: '<i class="far fa-file-excel"></i> Excel',
          exportOptions: {
            columns: [ 0, 1, 2, 3, 4, 5, 6, 7 ]
          }
      },
      {
          extend: 'pdfHtml5',
          className: 'btn border shadow-sm',
          text: '<i class="far fa-file-pdf"></i> Pdf',
          filename: 'BL Suppliers Report_pdf',
          orientation: 'portrait',
          alignment: 'center',
          pageSize: 'A4',
          alignment: "center",
          exportOptions: {
           columns: [ 0, 1, 2, 3, 4, 5, 6 ]
          }
      },
      {
          extend: 'print',
          className: 'btn border shadow-sm',
          exportOptions: {
            columns: [ 0, 1, 2, 3, 4, 5, 6 ]
        }
    }],
    }
    
     ]
  });

  table.buttons().container()
  .appendTo( '#example_wrapper .col-md-6:eq(0)' );
}

setTimeout(tableAdd, 500);

      const deletebtn = document.querySelectorAll('.delete-final');
      deletebtn.forEach(btn =>{
        btn.addEventListener('click', async (e)=>{
          try {
            console.log(e.target.dataset.id)
            await deleteDetails(e.target.dataset.id); 
            
        } catch (error) {
          console.log(error);
         }
        });
      });
        const editbtn = document.querySelectorAll('.edit-btn');
      editbtn.forEach((btn) =>{
        btn.addEventListener('click', async (e)=>{
          try{
            console.log(e.target.parentElement.parentElement)
         const doc = await editLoad(e.target.dataset.id);
          const loanData = doc.data();

          editStatus = true;
          id = doc.id;

          form['name'].value = loanData.name;
          form['amount'].value = loanData.amount;
         form['date'].value = loanData.date;
          form['end-date'].value = loanData.enddate;       
          form['rate'].value = loanData.rate;
          console.log(loanData.name);

          form['submit'].innerText = "Update";
          
        } catch(error) {
            console.log(error);
          }
          
        });
        });  
        if(parse > calcInt){
          notification.innerHTML += `<div class="text-success toast not-toast show shadow-none border-0" data-autohide="false">
            <div class="toast-header">
              <small class="text-dark">${name}</small>
              <small class="not-time text-muted">${(Math.abs(ndays - float)) > 1 ? `${Math.abs(ndays - float)} days ago` : `${Math.abs(ndays - float)} day ago`}</small>
            </div>
            <div class="toast-body alert alert-success" role="alert">
              Please collect the interest amount <b>रु ${num}</b> from <b>${name}</b>.
            </div>
            </div><hr class="hr not-hr" style="opacity: 0.05;">`;
               }

               if((Math.abs(num_days) <= 7 && parse < calcInt)){
                notification.innerHTML += `<div class="text-warning toast not-toast show shadow-none border-0" data-autohide="false">
            <div class="toast-header">
              <small class="text-dark">${name}</small>
            </div>
            <div class="toast-body alert alert-warning" role="alert">
              Warning! Please collect the interest amount <b>रु ${num}</b> from <b>${name}</b> after ${(Math.abs(ndays - float)) > 1 ? `${Math.abs(ndays - float)} days` : `${Math.abs(ndays - float)} day`}.
            </div>
            </div><hr class="hr not-hr" style="opacity: 0.05;">`;
               }
              

              });   
   });
  });

async function myFunction(e){
e.preventDefault();
//selecting inputs
let name = form['name'];
let amount = form['amount'];
let date = form['date'];
let enddate = form['end-date'];
let rate = form['rate'];
  
try{
  if(!editStatus){
    saveDetails(name.value, amount.value, date.value, enddate.value, rate.value);
  } else{
    await editDetails(id, { 
      name: name.value,    
      amount: amount.value,
      date: date.value,
      enddate: enddate.value,
      rate: rate.value,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })

     editStatus = false;
      id = '';
      form['submit'].innerText = "Save Data";
  }
  form.reset();
  var c = 0;
  if(c === 0){
  alert.style.display = "flex";
  alert.innerHTML = '<i class="far fa-check-circle"></i> Successfully Edited <button class="btn-close" data-bs-dismiss="alert">&times;</button>';
  c = 1;
  } else {
    alert.style.display = "none";
    c = 0;
  }
} catch(error){
  alert(error)
}
}

   
       
const arrayPie = [['Amount', 'Due Interest']];

   async function arrayP(parse, name){
    arrayPie.push([name, parse]);
     drawChart(arrayPie); 
  }

  var loan_array = [];

  function timer(){
    loan_array = [];
    var loan_table = document.querySelector("#tbody1");
var loan_rows = loan_table.children;
console.log(loan_rows.length)
for (var i = 0; i < loan_rows.length; i++) {
	var fields = loan_rows[i].children;

  loan_array.push(fields[0].innerText);
  var finIntTxt = JSON.stringify(fields[7].innerHTML);
  var fin_int = finIntTxt.match(/\d/g);
  fin_int = parseInt(fin_int.join(""));
  loan_array.push(fin_int);
}
  }
  setTimeout(timer, 5000);
  console.log(loan_array)



  // setTimeout(console.log(arrayPie), 0);
  // setInterval(arrayP, 100);


google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart(arrayPie) {

        var data = google.visualization.arrayToDataTable(arrayPie);

        var options = {
          title: 'My Daily Activities',
          is3D: true,
          animation: {
            duration: 1200,
            easing: 'out',
            startup: true
          },
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));
        function selectHandler() {
          var selectedItem = chart.getSelection()[0];
          if (selectedItem) {
            var topping = data.getValue(selectedItem.row, 0);
            console.log(('The user selected ' + topping))
          }
        }

        google.visualization.events.addListener(chart, 'select', selectHandler);

        chart.draw(data, options);
      }


//----------

const arrayBar = [['Amount', 'Interest', 'Due Interest']];
  
async function arrayB(parse, name, fint){
  arrayBar.push([name, fint, parse]);
  drawStuff(arrayBar); 
  drawLineChart(arrayBar);
}

google.charts.load('current', {'packages':['bar']});
      google.charts.setOnLoadCallback(drawStuff);

      function drawStuff(arrayBar) {
        var data = new google.visualization.arrayToDataTable(arrayBar);

        var options = {
          title: 'Random Graph',
          width: 900,
          chart: { title: 'Interest Amount Until Today',
                   subtitle: 'Fetched from live data' },
          bars: 'vertical', // Required for Material Bar Charts.
          series: {
            0: { axis: 'distance' }, // Bind series 0 to an axis named 'distance'.
            1: { axis: 'brightness' } // Bind series 1 to an axis named 'brightness'.
          },
          axes: {
            x: {
              distance: {label: 'parsecs'}, // Bottom x-axis.
              brightness: {side: 'top', label: 'apparent magnitude'},
              0: { side: 'top', label: 'Percentage'} // Top x-axis. 
            }
          },
        };

        var chart = new google.charts.Bar(document.getElementById('top_x_div'));
        chart.draw(data, options);
      };




      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawLineChart);

      function drawLineChart(arrayBar) {
        var data = google.visualization.arrayToDataTable(arrayBar);

        var options = {
          title: 'Due Interest',
          curveType: 'function',
          legend: { position: 'bottom' },
          animation: {
            duration: 1200,
            easing: 'out',
            startup: true
          },
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
      }

//  count notification js
 function count_it() {  
  var count = document.getElementsByClassName('toast').length;
  document.querySelector('.not-badge').innerText = count + '+';
  console.log(count);
  if(count === 0) {
    document.querySelector('.toast-container').innerHTML = `<span>
    <img src='err_notification.webp' style='width: 342.5px; text-align: center; pointer-events: none;'></img>
    </span><br>`;
  }
}
setInterval(count_it, 2000);

document.querySelector('.not-btn').onclick = (e)=>{
  e.cssText = "color: black !important;";
  document.querySelector('.not-i').classList = "far fa-bell not-i text-primary";
  document.querySelector('.toast-wrapper').style.display = "block";
}

document.querySelector('.close-not').onclick = ()=>{
  document.querySelector('.toast-wrapper').style.display = "none";
  document.querySelector('.not-i').classList = "far fa-bell not-i";
}

document.querySelector('.expense-form').addEventListener("submit", exFunction);

let ex_editStatus = false;
let ex_id = '';

const ex_saveDetails = (ex_name, ex_amount, ex_type, ex_date) =>{
  db.collection('expense').doc().set({
    ex_name: ex_name,
    ex_amount: ex_amount,
    ex_type: ex_type,
    ex_date: ex_date
  })
};

var ex_currentDate = new Date();
var ex_day = ex_currentDate.getDate();
var ex_month = ex_currentDate.getMonth() + 1;
var ex_year = ex_currentDate.getFullYear();
const ex_date = `${ex_day}-${ex_month}-${ex_year}`;
console.log(ex_date);

const ex_getDetails = () => db.collection('expense').get();
const ex_editLoad = (ex_id) => db.collection('expense').doc(ex_id).get();
const ex_onGetDetails = (callback) => db.collection('expense').onSnapshot(callback);
const ex_deleteDetails = ex_id => db.collection('expense').doc(ex_id).delete();

window.addEventListener("DOMContentLoaded", async (e) =>{
    ex_onGetDetails((snapshot) =>{
      var ex_body = document.querySelector('#tbody2');
      var ex_sec_body = document.querySelector('#tbody3');
      ex_body.innerHTML = "";
      ex_sec_body.innerHTML = "";
       snapshot.forEach(ex_doc =>{
        var ex_name = ex_doc.data().ex_name;
        var ex_amount = ex_doc.data().ex_amount;
         var ex_type = ex_doc.data().ex_type;
         var ex_added_date = ex_doc.data().ex_date;
        
        const ex_task = ex_doc.data();
        ex_task.id = ex_doc.id;

        var ex_body = document.querySelector("#tbody2");
        var ex_sec_body = document.querySelector('#tbody3');
      `${(ex_amount > 0) ? ex_body.innerHTML += `<tr class="text-success bg-light shadow-sm">
      <td style="max-width: 0px;"> <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
      width="16" height="16"
      viewBox="0 0 172 172"
      style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g><path d="M75.25,161.25v-107.5h-31.2137l41.9637,-42.1056l41.9637,42.1056h-31.2137v107.5z" fill="#bae0bd"></path><path d="M86,14.6931l36.7865,36.9069h-23.8865h-4.3v4.3v103.2h-17.2v-103.2v-4.3h-4.3h-23.8865l36.7865,-36.9069M86,8.6l-47.1409,47.3h34.2409v107.5h25.8v-107.5h34.2409l-47.1409,-47.3z" fill="#5e9c76"></path></g></g></svg></td>
    <td>${ex_name}</td>
    <td id="ex-add-amount">${ex_amount}</td>
    <td id="ex-type">${ex_type}</td>
    <td id="ex-date">${ex_added_date}</td>
    <td><button class="btn text-danger ex_btn-delete shadow-none bg-light py-0" data-id="${ex_task.id}" style="font-size: 20px; margin: 0;">&times;</button></td>
    </tr>`
    : ex_sec_body.innerHTML += `<tr class="text-danger bg-light shadow-sm">
    <td style="max-width: 0px;"><img src="https://img.icons8.com/small/16/fa314a/long-arrow-down.png"/></img></td>
    <td>${ex_name}</td>
    <td id="ex-amount">${ex_amount}</td>
    <td id="ex-type">${ex_type}</td>
    <td id="ex-date">${ex_added_date}</td>
    <td><button class="btn text-danger ex_btn-delete bg-light py-0 shadow-none" data-id="${ex_task.id}" style="font-size: 20px; margin: 0;">&times;</button></td>
    </tr>`}`;
   
        const ex_deletebtn = document.querySelectorAll('.ex_btn-delete');
        ex_deletebtn.forEach(ex_btn =>{
          ex_btn.addEventListener('click', async (e)=>{
           await ex_deleteDetails(e.target.dataset.id);
          });
          });
         
     });
    })
  });
        var ex_in_total = document.querySelector('.ex_in_total');
        var ex_out_total = document.querySelector('.ex_out_total');

  async function ex_expense(){

      var in_table = document.querySelector("#ex_table-menu"), in_sumVal = 0;           
      for(var i = 0; i < in_table.rows.length; i++)
      { in_sumVal = in_sumVal + parseInt(in_table.rows[i].cells[2].innerHTML); }

      var out_table = document.querySelector("#ex_table-menu-2"), out_sumVal = 0;      
      for(var a = 0; a < out_table.rows.length; a++)
      { out_sumVal = out_sumVal + parseInt(out_table.rows[a].cells[2].innerHTML); }
      
      ex_in_total.innerText = "रु " + in_sumVal.toLocaleString();
      ex_out_total.innerText = "रु " + out_sumVal.toLocaleString();
      total_ex(in_sumVal, out_sumVal);
  }
  setInterval(ex_expense, 100);
  
  const ex_type_value = document.getElementById("expense-type-value");
  ex_type_value.innerText = "Cash";
  let ex_type = document.getElementById('expense-type');
  ex_type.onclick = ()=>{
   var x = ex_type.options[ex_type.selectedIndex].text;
   ex_type_value.innerText = x;
  }

  async function total_ex(in_sumVal, out_sumVal){
    document.querySelector('#total-expense').innerText = "रु " + (in_sumVal - Math.abs(out_sumVal)).toLocaleString();
    var ex_income_to_expense_per = Math.abs(eval((in_sumVal/out_sumVal)*100)).toFixed(0);
    var ex_expense_to_income_per = eval((out_sumVal/in_sumVal)*100).toFixed(0);
    if(ex_income_to_expense_per !=0){
      document.querySelector('.ex_income_to_expense_per').innerText = ex_income_to_expense_per + '%';
    } else{
      document.querySelector('.ex_income_to_expense_per').style.display = "none";
    }
    if(ex_expense_to_income_per !=0){
      document.querySelector('.ex_expense_to_income_per').innerText = ex_expense_to_income_per + '%';
    } else{
      document.querySelector('.ex_expense_to_income_per').style.display = "none";
    }
  }
  
  
  async function exFunction(e){
  e.preventDefault();
  //selecting inputs
  let ex_name = ex_form['expense-name'];
  let ex_amount = ex_form['expense-amount'];
  let ex_type = ex_type_value.innerText;

  try{
    if(!ex_editStatus){
      ex_saveDetails(ex_name.value, ex_amount.value, ex_type, ex_date);
    }
    ex_form.reset();
  } catch(error){
    console.log(error);
  }
  }
    function searchFunction(){
            $("#myInput").on("keyup", function() {
              var value = $(this).val().toLowerCase();
              $("#tbody2 tr").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
              });
            });
          }

setTimeout(searchFunction, 2000);

document.querySelector('.de_form').addEventListener("submit", deFunction);

let de_editStatus = false;
let de_id = '';

const de_saveDetails = (de_name, de_info) =>{
  db.collection('details').doc().set({
    de_name: de_name,
    de_info: de_info
  })
};

const de_getDetails = () => db.collection('details').get();
const de_editLoad = (de_id) => db.collection('details').doc(de_id).get();
const de_onGetDetails = (callback) => db.collection('details').onSnapshot(callback);
const de_deleteDetails = de_id => db.collection('details').doc(de_id).delete();
const de_editDetails = (de_id, updated) => db.collection('details').doc(de_id).update(updated);

window.addEventListener("DOMContentLoaded", async (e) =>{
    de_onGetDetails((snapshot) =>{
      var de_body = document.querySelector('#de_tbody');
  de_body.innerHTML = "";
       snapshot.forEach(de_doc =>{
        var de_name = de_doc.data().de_name;
        var de_info = de_doc.data().de_info;
        
        const de_task = de_doc.data();
        de_task.id = de_doc.id;

        var de_body = document.querySelector("#de_tbody");
      de_body.innerHTML += `<tr> 
    <td style="opacity: 0.85;">${de_name}</td>
    <td id="de_info">${de_info}</td>
    <td><button class="btn de_edit-btn shadow-none bi bi-pencil p-0 m-1" data-id="${de_task.id}"></button>
    <button class="btn de_btn-delete shadow-none bi bi-trash p-0 m-1" data-id="${de_task.id}"></button></td>
    </tr>`;
   
        const de_deletebtn = document.querySelectorAll('.de_btn-delete');
        de_deletebtn.forEach(de_btn =>{
          de_btn.addEventListener('click', async (e)=>{
           await de_deleteDetails(e.target.dataset.id);
          });
          });

          const de_editbtn = document.querySelectorAll('.de_edit-btn');
      de_editbtn.forEach((btn) =>{
        btn.addEventListener('click', async (e)=>{
          try{
            console.log(e.target.parentElement.parentElement)
         const de_doc = await de_editLoad(e.target.dataset.id);
          const de_Data = de_doc.data();

          de_editStatus = true;
          de_id = de_doc.id;

          details_form['de_name'].value = de_Data.de_name;
          details_form['de_info'].value = de_Data.de_info;          
        } catch(error) {
            console.log(error);
          }
          
        });
        });  
         
     });
    })
  });

  async function deFunction(e){
    e.preventDefault();
    //selecting inputs
    let de_name = details_form['de_name'];
    let de_info = details_form['de_info'];
  
    try{
      if(!de_editStatus){
        de_saveDetails(de_name.value, de_info.value);
      } else{
        await de_editDetails(de_id, { 
          de_name: de_name.value,    
          de_info: de_info.value,
        })
    
         de_editStatus = false;
          de_id = '';
      }
      details_form.reset();
    } catch(error){
      console.log(error);
    }
    }
         var counter = 0;   
         document.querySelector('.toggle-nav').onclick = (e) =>{
          // console.log(e.childNode[0].className);
           if(counter === 0){
           document.querySelector('.nav-content').style.cssText = "margin-left: 10px;";
           document.querySelector('.nav-bar').style.cssText = "margin-left: -270px;";
           document.querySelector('.header').style.cssText = "min-width: 100%; margin-left: 0px;";
           counter = 1;
          } else{
            document.querySelector('.nav-content').style.cssText = "margin-left: 280px;";
           document.querySelector('.nav-bar').style.cssText = "margin-left: 0px;";
           document.querySelector('.header').style.cssText = "width: calc(100% - 270px);";
           counter = 0;
          }       
         }

          // $('#inv_status').simpleSelect();

          const sub_loan_1 = document.querySelector('#sub-loan-1');
          const sub_loan_2 = document.querySelector('#sub-loan-2');
          sub_loan_1.onclick = ()=>{
            sub_loan_1.className = "nav-item bg-secondary";
            sub_loan_2.className = "nav-item";
          }
          sub_loan_2.onclick = ()=>{
            sub_loan_2.className = "nav-item bg-secondary";
            sub_loan_1.className = "nav-item";
          }

          document.querySelectorAll('.inv_gen_form input').forEach(e=>{
            e.className = "form-control shadow-none";
          })

          document.querySelector('.inv_gen_form').addEventListener("submit", invFunction);

let invList_editStatus = false;
let invList_id = '';

const invList_saveDetails = (inv_bill, inv_date, inv_name, inv_pan, inv_description, inv_cost, inv_quantity, inv_status, inv_vehicle, inv_pre_total) =>{
  db.collection('invoice_data').doc().set({
          inv_bill: inv_bill,    
          inv_date:  inv_date,
          inv_name: inv_name,    
          inv_pan: inv_pan,
          inv_description: inv_description,    
          inv_cost: inv_cost,
          inv_quantity: inv_quantity,    
          inv_status: inv_status,
          inv_vehicle: inv_vehicle,
          inv_total: inv_pre_total
  })
};

const invList_getDetails = () => db.collection('invoice_data').get();
const invList_editLoad = (invList_id) => db.collection('invoice_data').doc(invList_id).get();
const invList_onGetDetails = (callback) => db.collection('invoice_data').onSnapshot(callback);
const invList_deleteDetails = invList_id => db.collection('invoice_data').doc(invList_id).delete();


window.addEventListener("DOMContentLoaded", async (e) =>{
    invList_onGetDetails((snapshot) =>{
      var invList_body = document.querySelector('.inv_list_tbody');
  invList_body.innerHTML = "";
       snapshot.forEach(invList_doc =>{
        var inv_bill = invList_doc.data().inv_bill;
        var inv_name = invList_doc.data().inv_name;
        var inv_date = invList_doc.data().inv_date;
        var inv_description = invList_doc.data().inv_description;
        var inv_cost = invList_doc.data().inv_cost;
        var inv_quantity = invList_doc.data().inv_quantity;
        var inv_status = invList_doc.data().inv_status;
        var inv_gen_id = invList_doc.data().inv_pan;
        var inv_amount = invList_doc.data().inv_total;
        var inv_vehicle = invList_doc.data().inv_vehicle;
      
        const invList_task = invList_doc.data();
        invList_task.id = invList_doc.id;

        var invList_body = document.querySelector(".inv_list_tbody");
      invList_body.innerHTML += `<tr> 
    <td class="text-align: center !important;">${inv_bill}</td>
    <td class="text-primary" title="${inv_gen_id}">${inv_gen_id}</td>
    <td>${inv_date}</td>
    <td>${inv_name}</td>
    <td class="d-none">${inv_description}</td>
    <td class="d-none">${inv_cost}</td>
    <td class="d-none">${inv_quantity}</td>
    <td>${inv_amount}</td>
    ${(inv_status === "Completed") ? `<td title="Paid invoice"><p class="btn btn-outline-success">Paid</p></td>`
     : (inv_status === "Cancelled") ? `<td title="Unpaid invoice"><p class="btn btn-outline-danger">Unpaid</p></td>`
    : `<td title="Pending invoice"><button class="btn btn-outline-info btn-pending shadow-none">Pending</button></td>`}
    <td class="d-none">${inv_vehicle}</td>
    <td>
    <button class="btn shadow-none view-pdf p-0 m-2" data-bs-toggle="modal" data-bs-target="#staticBackdropView${invList_task.id}" title="View invoice"><i class="bi bi-eye"></i></button>
    <div class="modal fade loan_modal-box" id="staticBackdropView${invList_task.id}" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Preview</h5>
            <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal">&times;</button>
          </div>
       <div class="modal-body p-4 px-3 modal-invoice-preview" style="text-align: left;">
            <p>This is the invoice preview for bill no. ${inv_bill} of ${inv_name}</p>
        <div class="card">
          <table style="width: 100%;">
            <td> <ul class="list-group list-group-flush" style="opacity: 0.9;">
              <li class="list-group-item">Bill No.</li>
              <li class="list-group-item">Invoice No.</li>
              <li class="list-group-item">Invoice To</li>
              <li class="list-group-item">Status</li>
              <li class="list-group-item">Vehicle No.</li>
              <li class="list-group-item">Item Description</li>
              <li class="list-group-item">Unit Cost</li>
              <li class="list-group-item">Quantity</li>
              <li class="list-group-item">VAT Amount</li>
              <li class="list-group-item bg-light"><b>Total Amount</b></li>
            </ul></td>
            <td> <ul class="list-group list-group-flush" style="text-align: left;">
              <li class="list-group-item text-primary inv_view_bill">${inv_bill}</li>
              <li class="list-group-item inv_view_inv_no">${inv_gen_id}</li>
              <li class="list-group-item inv_view_name"><b>${inv_name}</b></li>
              ${(inv_status === "Completed") ? `<li class="list-group-item text-success inv_view_status">${inv_status}</li>`
     : (inv_status === "Cancelled") ? `<li class="list-group-item text-danger inv_view_status">${inv_status}</li>`
    : `<li class="list-group-item text-primary inv_view_status">${inv_status}</li>`}
              <li class="list-group-item inv_view_vehicle">${inv_vehicle}</li>
              <li class="list-group-item inv_view_item">${inv_description}</li>
              <li class="list-group-item inv_view_cost">${inv_cost}</li>
              <li class="list-group-item inv_view_qty">${inv_quantity}</li>
              <li class="list-group-item inv_view_vat">रु ${eval((0.13*inv_amount)).toFixed(0)}</li>
              ${(inv_status === "Cancelled") ? `<li class="list-group-item text-danger inv_view_fin_amount">रु ${eval(inv_amount)}</li>`
               : `<li class="list-group-item text-success inv_view_fin_amount bg-light">रु ${eval(inv_amount)}</li>`}
            </ul></td>
          </table>
        </div>
      </div>
      
  <div class="modal-footer">
    <button type="button" class="btn btn-secondary shadow-none" data-bs-dismiss="modal">Close</button>
    <button type="button" class="btn btn-danger invList_btn-delete shadow-none" data-id="${invList_task.id}" data-bs-dismiss="modal">Delete</button>
  </div>

  </div>
  </div>
  </div>

    <button class="btn shadow-none export-pdf p-0 m-2" title="Print invoice" data-bs-toggle="modal" data-bs-target="#print_report"><i class="bi bi-printer"></i></button>
    <button class="btn me-2 shadow-none invList_btn-delete p-0 m-1" data-bs-toggle="modal" data-bs-target="#staticBackdrop${invList_task.id}" title="Delete invoice"><i class="bi bi-trash"></i></button>

  <div class="modal fade loan_modal-box" id="staticBackdrop${invList_task.id}" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Delete Data</h5>
          <button type="button" class="btn-close bg-white shadow-none" data-bs-dismiss="modal">&times;</button>
        </div>
     <div class="modal-body p-4 px-3" style="text-align: left;">Are you sure you want to delete the data for ${inv_name}?</div>
<div class="modal-footer">
  <button type="button" class="btn btn-secondary shadow-none" data-bs-dismiss="modal">Close</button>
  <button type="button" class="btn btn-danger invList_btn-delete shadow-none" data-id="${invList_task.id}" data-bs-dismiss="modal">Delete</button>
</div>
</div>
</div>
</div>
    </td>
    </tr>`;

document.querySelectorAll('.export-pdf').forEach(e =>{
  e.addEventListener('click', async (a)=>{    

    const childNode = (a.target.parentElement.parentElement.parentElement.children);

    document.querySelector('.inv_report_download').innerHTML = `<tr>
    <td>${childNode[0].innerText}</td>
    <td>${childNode[4].innerText}</td>
    <td>Rs ${childNode[5].innerText}</td>
    <td>${childNode[6].innerText}</td>
    </tr>`;

    document.querySelector('.inv_header_customer_name').innerHTML = childNode[3].innerText;  
    document.querySelector('.inv_header_date').innerText = childNode[2].innerText; 
    document.querySelector('.inv_header_invoice_id').innerText = childNode[1].innerText;

    document.querySelector('.inv_total_tbody').innerHTML = `<tr><td>Subtotal</td>
    <td>Rs ${childNode[7].innerText}</td></tr>
    
    <tr><td>VAT (13%)</td>
    <td>Rs ${(eval((0.13*childNode[7].innerText))).toFixed(1)}</td></tr>
      
    <tr style="background: rgba(238, 238, 238, 0.867); font-weight: bold;"><td>Total</td>
    <td>Rs ${eval((0.13*childNode[7].innerText)) + eval(childNode[7].innerText)}</td>
    </tr>`;

    document.querySelector('.inv-header-status').innerHTML = `${(childNode[8].innerText) === 'Paid' ? `<a style="color: rgb(10, 133, 10); text-decoration: none;">${childNode[8].innerText}</a>`
     : (childNode[8].innerText) === 'Unpaid' ? `<a class="text-danger" style="text-decoration: none;">${childNode[8].innerText}</a>`
    : `<a style="text-decoration: none;">${childNode[8].innerText}</a>`}`;

    

  });
});


        const invList_deletebtn = document.querySelectorAll('.invList_btn-delete');
        invList_deletebtn.forEach(invList_btn =>{
          invList_btn.addEventListener('click', async (e)=>{
           await invList_deleteDetails(e.target.dataset.id);
          });
          });
         
     });
    })
  });

  document.querySelector('#print_final_pdf').onclick = () => {

    kendo.pdf.defineFont({
      "DejaVu Sans"             : "https://kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans.ttf",
      "DejaVu Sans|Bold"        : "https://kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Bold.ttf",
      "DejaVu Sans|Bold|Italic" : "https://kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Oblique.ttf",
      "DejaVu Sans|Italic"      : "https://kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Oblique.ttf",
      "WebComponentsIcons"      : "https://kendo.cdn.telerik.com/2017.1.223/styles/fonts/glyphs/WebComponentsIcons.ttf"
    });

    kendo.drawing.drawDOM($("#invoice"))
      .then(function(group) {
          // Render the result as a PDF file
          return kendo.drawing.exportPDF(group, {
              paperSize: "A4",
              margin: { left: "0.05cm", top: "0cm", right: "0.05cm", bottom: "0.2cm" }
          });
      })
      .done(function(data) {
          // Save the PDF file
          kendo.saveAs({
              dataURI: data,
              fileName: "Bl_Suppliers_Invoice.pdf",
              proxyURL: "https://demos.telerik.com/kendo-ui/service/export"
          });
      });
  }

  async function invFunction(e){
    e.preventDefault();
    //selecting inputs
           let inv_bill  = inv_gen_form['inv_bill'].value;
           let inv_date =  inv_gen_form['inv_date'].value;
           let inv_name  = inv_gen_form['inv_name'].value;
           let inv_pan  = inv_gen_form['inv_pan'].value;
           let inv_description  = inv_gen_form['inv_description'].value;
           let inv_cost  = inv_gen_form['inv_cost'].value;
           let inv_quantity  = inv_gen_form['inv_quantity'].value;
           let inv_status_store = inv_gen_form['inv_status'];
           let inv_vehicle = inv_gen_form['inv_vehicle'].value;
           let inv_pre_total = inv_gen_form['inv_pre_total'].value;
           let inv_status = inv_status_store.options[inv_status_store.selectedIndex].text;
  
    try{
      if(!invList_editStatus){
        invList_saveDetails(inv_bill, inv_date, inv_name, inv_pan, inv_description, inv_cost, inv_quantity, inv_status, inv_vehicle, inv_pre_total );
      } 
      inv_gen_form.reset();
    } catch(error){
      console.log(error);
    }
    }

document.querySelectorAll('.nav-link').forEach(e =>{
  e.onclick = ()=>{
    location.hash = e.id;
  }   
});

function loanBack () {
     document.querySelector('#sub-loan-3').className = "nav-item";
     document.querySelector('#sub-loan3').className = "tab-pane fade";
     document.querySelector('#sub-loan-2').className = "nav-item bg-secondary";
     document.querySelector('#sub-loan2').className = "tab-pane fade show active"; 
}

function inv_searchFunction() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("inv_search_input");
  filter = input.value.toUpperCase();
  table = document.querySelector(".inv_list_table");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[3];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
}


var ledgerVisual_array = [];
var ledger_table = document.querySelector(".inv_list_tbody");
var rows = ledger_table.children;

function delayInvListData(){
for (var i = 0; i < rows.length; i++) {
  var fields = rows[i].children;
  ledgerVisual_array.push({ 
    pan: +fields[1].innerText,
    name: fields[3].innerText,
    transaction: +fields[7].innerText,
  });
}
}
setTimeout(delayInvListData, 2000);

$('#invoice-visuals-tab').one('click', ()=>{
  // Cause the PAN in ledger_result array is in ascending order so while fetching the name property from
//  ledgerVisual_array the PAN no. must be in the same order
  function sortByProperty(property){  
    return function(a,b){  
       if(a[property] > b[property])  
          return 1;  
       else if(a[property] < b[property])  
          return -1;  
   
       return 0;  
    }  
  }
  ledgerVisual_array.sort(sortByProperty('pan'))
  
  var group_to_values = ledgerVisual_array.reduce(function (obj, item) {
   obj[item.pan] = obj[item.pan] || [];
   obj[item.pan].push(item.transaction);
   return obj;
  }, {});
  
  var groups = Object.keys(group_to_values).map(function (key) {
   return { pan: key, transaction: group_to_values[key], NoOfTransaction: group_to_values[key]};
  });
  
  let ledger_result = [];
  const resultObj = {};
  
   for (let i = 0; i < groups.length; i++) {
   const sum = findSum(groups[i].transaction);
   const val = findNum(groups[i].transaction);
   ledger_result.push({ pan: groups[i].pan, totalTransaction: sum, NoOfTransaction: val });
  }
  
  function findNum(transaction){
   return transaction.length
  }
  function findSum(arr) {
   let sum = 0;
   for (let i = 0; i < arr.length; i++) {
     sum += arr[i];
   }
   return sum;
  }
  
   var res = ledgerVisual_array.reduce((a,b)=>{
     for (var i = 0; i < rows.length; i++) {
  
     if((a.filter(i=> i.pan == b.pan).length == 0)){
     a.push(b)
    }
   }
   return a
    },[])
  
  arr_final = [];
  
  for(let i in res){
   arr_final.push({name: res[i].name, pan: ledger_result[i].pan, totalTransaction: ledger_result[i].totalTransaction, NoOfTransaction: ledger_result[i].NoOfTransaction});  
   }
  
   console.log(arr_final)
  
  
  var chart_arr_category = [];
  var chart_arr_val = [];
  var chart_arr_transaction_count = [];
  for (let i in arr_final){
   chart_arr_category.push(arr_final[i].name);
   chart_arr_val.push(arr_final[i].totalTransaction);
   chart_arr_transaction_count.push(arr_final[i].NoOfTransaction)
  }
  
   var pieOptions = {
   series: chart_arr_val,
   chart: {
   type: 'pie',
  },
  labels: chart_arr_category,
  title: {
    text: 'Chart based on Transaction Amount'
  },
  responsive: [{
   breakpoint: 480,
   options: {
     chart: {
       width: 200
     },
     legend: {
       position: 'bottom'
     }
   }
  }]
  };
  
  var pie_chart = new ApexCharts(document.querySelector("#ledger_piechart"), pieOptions);
  pie_chart.render();


  var donutOptions = {
    series: chart_arr_transaction_count,
    chart: {
    type: 'donut',
  },
  plotOptions: {
    pie: {
      startAngle: -90,
      endAngle: 270,
      donut: {
        labels: {
          show: true,
          total: {
            showAlways: true,
            show: true
          }}}

    }
  },
  labels: chart_arr_category,
  dataLabels: {
    enabled: true
  },
  fill: {
    type: 'gradient',
  },
  legend: {
    enabled: true,
  },
  title: {
    text: 'Chart based on no. of Transactions'
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
  };

  var donutChart = new ApexCharts(document.querySelector("#ledger_donutchart"), donutOptions);
  donutChart.render();
  
  
  
  var barOptions = {
    chart: {
    height: 550,
    type: 'bar',
  },
  plotOptions: {
    bar: {
      dataLabels: {
        position: 'top', // top, center, bottom
      },
      // barHeight: '100%',
      distributed: true,
      horizontal: true,
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      return "रु " + val ;
    },
    offsetX: -20,
    style: {
      fontSize: '12px',
      colors: ["#ffffff"]
    }
  },

series: [{
    name: 'Sales',
    data: chart_arr_val
  }],
  
  xaxis: {
    categories: chart_arr_category
  },
  title: {
    text: 'Sales Report',
    floating: true,
    align: 'center',
    style: {
      color: '#000000'
    }
  }
  };
  
  var ledger_bar_chart = new ApexCharts(document.querySelector("#ledger_column_chart"), barOptions);
  
  ledger_bar_chart.render();
});

document.querySelectorAll('table tr').forEach(e => {
  console.log(e)
});