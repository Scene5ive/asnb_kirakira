let data_labels = [];
let data_datasets = [
    {
        label: 'modal spent',
        data: [],
        fill: false,
        backgroundColor: window.chartColors.orange_2_opa,
        borderColor: window.chartColors.orange_2,
        borderWidth: 1
    },
    {
        label: 'cash return',
        data: [],
        fill: false,
        backgroundColor: window.chartColors.blue_2_opa,
        borderColor: window.chartColors.blue_2,
        borderWidth: 1
    },
    {
        label: 'cumulative principal',
        data: [],
        fill: false,
        backgroundColor: window.chartColors.red_2_opa,
        borderColor: window.chartColors.red_2,
        borderWidth: 1
    }, 
    {
        label: 'outstanding balance',
        data: [],
        fill: false,
        backgroundColor: window.chartColors.cyan_opa,
        borderColor: window.chartColors.cyan,
        borderWidth: 1
    }
]
let options_scales_xAxes_scaleLabel_labelString = [];
let config = {
    type: 'line',
    data: {
        labels: [],
        datasets: data_datasets
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'ASB Calculation'
        },
        tooltips: {
            mode: 'index',
            callbacks:{
                footer: function(tooltipItems, data){
                    return tooltipCallback(tooltipItems, data);
                }
            },
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: options_scales_xAxes_scaleLabel_labelString
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Amount'
                }
            }]
        }
    }
};

window.onload = function() {
    //Main Chart
    var ctx = document.getElementById('canvas').getContext('2d');
    window.myLine = new Chart(ctx, config);

    //Modal Chart
    var ctx_modal = document.getElementById('canvas_modal').getContext('2d');
    // window.myLine_modal = new Chart(ctx_modal, config_modal);
    window.myLine_modal = new Chart(ctx_modal, {
        type: 'line', 
        data: {
            labels: [90, 91, 92, 93, 94, 95, 96, 97, 98, 99,
                00, 01, 02, 03, 04, 05, 06, 07, 08, 09,
                10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
            datasets: [
                {
                    label: 'ASB Dividend Rate',
                    data: [0.14, 0.125, 0.125, 0.135, 0.14, 
                        0.13, 0.1325, 0.115, 0.105, 0.1,
                        0.1175, 0.1, 0.09, 0.0925, 0.0925,
                        0.09, 0.0855, 0.09, 0.0875, 0.0855,
                        0.0875, 0.0880, 0.0890, 0.0870, 0.0850,
                        0.0725, 0.0725, 0.0825, 0.07, 0.055],
                    fill: true,
                    backgroundColor: window.chartColors.red_opa,
                    borderColor: window.chartColors.red,
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Year'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Rate'
                    }
                }]
            }
        }
    });

    let row = 0;

    dividendRate.forEach(value => {
        row++;
        if((new Date()).getFullYear()===value.year){
        }
        addDividendModal(row, value.year, (value.rate).toFixed(4));
    });

    defaultValue();
    lookForChangesInTable();
};

document.getElementById('button_save').addEventListener('click', function(){
});

document.getElementById('button_update_chart').addEventListener('click', function(){
    if(document.querySelector("#table_body").rows.length>0){
        for(let i = 0; i<document.querySelector("#table_body").rows.length; i++){
    
            let row = i+1;
        
            if(document.getElementById(`show_${row}`).checked){     
                
                let loan_amount = document.getElementById(`loan_amount_option_${row}`).value;
                let insurance_amount = document.getElementById(`insurance_amount_${row}`).value;
                let profit_rate = document.getElementById(`profit_rate_${row}`).value;
                profit_rate = profit_rate/100;
                let tenure = document.getElementById(`tenure_option_${row}`).value;
                let start_year = document.getElementById(`start_year_option_${row}`).value;
                let start_month = document.getElementById(`start_month_option_${row}`).value;
                let investment_period = document.getElementById(`investment_period_option_${row}`).value;
                let type = 'year';
            
                let start_date = `${start_year}-${start_month}`;
            
                let result = amortizationCompound(
                    parseFloat(loan_amount), 
                    parseFloat(insurance_amount), 
                    parseFloat(profit_rate), 
                    parseInt(tenure), 
                    new Date(start_date), 
                    parseInt(investment_period), 
                    type);

                let getLabel = changeLabel(type, 'en-us', 'short', result);
                
                //Replace x-axis labels to current one
                config.data.labels = getLabel.config_data_labels;
                config.options.scales.xAxes[0].scaleLabel.labelString = getLabel.options_scales_xAxes_scaleLabel_labelString;
            
                //Replace the datasets
                config.data.datasets.forEach( dataset => {
                    changeDataset(dataset, result);
                })
            
                window.myLine.update();
            }
        }
    }
})

document.getElementById("button_add").addEventListener('click', function(){
    //Do something
    let rowNumToAdd = document.querySelector("#table_body").rows.length + 1;
    addNewRow(rowNumToAdd);
});

function defaultValue(){
    let loan_amount = document.getElementById('loan_amount_option_1').value;
    let insurance_amount = document.getElementById('insurance_amount_1').value;
    let profit_rate = document.getElementById('profit_rate_1').value;
    profit_rate = profit_rate/100;
    let tenure = document.getElementById('tenure_option_1').value;
    let start_year = document.getElementById('start_year_option_1').value;
    let start_month = document.getElementById('start_month_option_1').value;
    let investment_period = document.getElementById('investment_period_option_1').value;
    let type = 'year';

    let start_date = `${start_year}-${start_month}`;

    let result = amortizationCompound(
        parseFloat(loan_amount), 
        parseFloat(insurance_amount), 
        parseFloat(profit_rate), 
        parseInt(tenure), 
        new Date(start_date), 
        parseInt(investment_period), 
        type);

    //Show the monthly payment value based on the result
    document.getElementById('monthly_payment_amount_1').value = monthlyPaymentUpdate(result);
    
    let getLabel = changeLabel(type, 'en-us', 'short', result);

    //Replace x-axis labels to current one
    config.data.labels = getLabel.config_data_labels;
    config.options.scales.xAxes[0].scaleLabel.labelString = getLabel.options_scales_xAxes_scaleLabel_labelString;

    //Replace the datasets
    config.data.datasets.forEach( dataset => {
        changeDataset(dataset, result);
    })

    window.myLine.update();
}

function monthlyPaymentUpdate(result){
    return result.monthly_payment[0]
}

function changeLabel(param_type, param_language, param_labelType, param_result){
    let config_data_labels = [];
    let options_scales_xAxes_scaleLabel_labelString = [];

    //Replace the x-axis labels of the chart
    if(param_type === 'year'){
        config_data_labels = param_result.no_of_year;
        options_scales_xAxes_scaleLabel_labelString = 'Year';
    }else{
        let i = 0;
        let months = param_result.date_month;
        let monthsWithYear = months.map((month) => {
            i++;
            //If the month is January, then add the year to the array
            if(month === 1){
                return [(new Date(param_result.date_year[i-1], month-1)).toLocaleString(param_language, { month: param_labelType }), param_result.date_year[i-1]];  
            }else{
                return (new Date(param_result.date_year[i-1], month-1)).toLocaleString(param_language, { month: param_labelType });
            }
        });
        config_data_labels = monthsWithYear;
        options_scales_xAxes_scaleLabel_labelString = 'Month';
    }

    return {
        "config_data_labels": config_data_labels,
        "options_scales_xAxes_scaleLabel_labelString": options_scales_xAxes_scaleLabel_labelString
    }
}

function changeDataset(dataset, result){
    if(dataset.label === 'modal spent'){
        dataset.data = result.modal_spent.slice(0);
    }

    if(dataset.label === 'cash return'){
        dataset.data = result.cash_return.slice(0);
    }

    if(dataset.label === 'cumulative principal'){
        dataset.data = result.cumulative_principal.slice(0);
    }

    if(dataset.label === 'outstanding balance'){
        dataset.data = result.outstanding_balance.slice(0);
    }
}

function tooltipCallback(tooltipItems, data){
    let modal_spent = 0;
    let cash_return = 0;
    let profit = 0;
    let i = 0;
    let model_spent_index = 0;
    let cash_return_index = 0;

    data.datasets.forEach(dataset=>{
        if(dataset.label==='model spent'){
            model_spent_index = i;
        }
        if(dataset.label==='cash return'){
            cash_return_index = i;
        }
        i++;
    });

    tooltipItems.forEach(tooltipItem =>{
        modal_spent = data.datasets[model_spent_index].data[tooltipItem.index];
        cash_return = data.datasets[cash_return_index].data[tooltipItem.index];
    });
    
    profit = cash_return - modal_spent;

    return `Profit: RM ${profit.toFixed(2)}`;
}

function addNewRow(rowNum){

    let el_tr = document.createElement('tr');

    //Row number
    let el_th_row = document.createElement('th');
    el_th_row.scope="row";
    el_th_row.innerText=rowNum;

    //Loan amount
    let el_td_loan_amount = document.createElement('td');
    let el_div_loan_amount = document.createElement('div');
    el_div_loan_amount.className='input-group input-group-sm';
    el_div_loan_amount.innerHTML=`
        <div class='input-group-prepend'>
            <span class='input-group-text'>RM</span>
        </div>
        <select id='loan_amount_option_${rowNum}' class='custom-select'>
            <option selected>0</option>
            <option>10000</option>
            <option>15000</option>
            <option>20000</option>
            <option>25000</option>
            <option>30000</option>
            <option>35000</option>
            <option>40000</option>
            <option>45000</option>
            <option>50000</option>
            <option>55000</option>
            <option>60000</option>
            <option>65000</option>
            <option>70000</option>
            <option>75000</option>
            <option>80000</option>
            <option>85000</option>
            <option>90000</option>
            <option>95000</option>
            <option>100000</option>
            <option>105000</option>
            <option>110000</option>
            <option>115000</option>
            <option>120000</option>
            <option>125000</option>
            <option>130000</option>
            <option>135000</option>
            <option>140000</option>
            <option>145000</option>
            <option>150000</option>
            <option>155000</option>
            <option>160000</option>
            <option>165000</option>
            <option>170000</option>
            <option>175000</option>
            <option>180000</option>
            <option>185000</option>
            <option>190000</option>
            <option>195000</option>
            <option>200000</option>
        </select>
        `;

    el_td_loan_amount.appendChild(el_div_loan_amount);

    //Insurance amount
    let el_td_insurance_amount = document.createElement('td');
    let el_div_insurance_amount = document.createElement('div');
    el_div_insurance_amount.className='input-group input-group-sm';
    el_div_insurance_amount.innerHTML=`
        <div class='input-group-prepend'>
            <span class='input-group-text'>RM</span>
        </div>
        <input id='insurance_amount_${rowNum}' type='text' class='form-control' value='0'>
        `;

    el_td_insurance_amount.appendChild(el_div_insurance_amount);

    //Profit rate
    let el_td_profit_rate = document.createElement('td');
    el_td_profit_rate.innerHTML = `<input id="profit_rate_${rowNum}" class="form-control form-control-sm" type="text" value="5.0">`

    //Tenure years
    let el_td_tenure = document.createElement('td');
    el_td_tenure.innerHTML=`
        <select id="tenure_option_${rowNum}" class="form-control form-control-sm">
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
            <option>13</option>
            <option>14</option>
            <option>15</option>
            <option>16</option>
            <option>17</option>
            <option>18</option>
            <option>19</option>
            <option>20</option>
            <option>21</option>
            <option>22</option>
            <option>23</option>
            <option>24</option>
            <option>25</option>
            <option>26</option>
            <option>27</option>
            <option>28</option>
            <option>29</option>
            <option selected>30</option>
        </select>`

    //Start year
    let el_td_start_year = document.createElement('td');
    el_td_start_year.innerHTML=`
        <select id="start_year_option_${rowNum}" class="form-control form-control-sm">
            <option>1990</option>
            <option>1995</option>
            <option>2000</option>
            <option>2005</option>
            <option>2010</option>
            <option>2011</option>
            <option>2012</option>
            <option>2013</option>
            <option>2014</option>
            <option>2015</option>
            <option>2016</option>
            <option>2017</option>
            <option>2018</option>
            <option>2019</option>
            <option>2020</option>
            <option>2021</option>
            <option>2022</option>
            <option>2023</option>
            <option>2024</option>
            <option>2025</option>
            <option>2026</option>
            <option>2027</option>
            <option>2028</option>
            <option>2029</option>
            <option>2030</option>
        </select>`

    //Start month
    let el_td_start_month = document.createElement('td');
    el_td_start_month.innerHTML=`
        <select id="start_month_option_${rowNum}" class="form-control form-control-sm">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
        </select>`

    //Investment period
    let el_td_investment_period = document.createElement('td');
    el_td_investment_period.innerHTML=`
        <select id="investment_period_option_${rowNum}" class="form-control form-control-sm">
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
            <option>13</option>
            <option>14</option>
            <option>15</option>
            <option>16</option>
            <option>17</option>
            <option>18</option>
            <option>19</option>
            <option>20</option>
            <option>21</option>
            <option>22</option>
            <option>23</option>
            <option>24</option>
            <option>25</option>
            <option>26</option>
            <option>27</option>
            <option>28</option>
            <option>29</option>
            <option selected>30</option>
        </select>`

    //Monthly payment
    let el_td_monthly_payment = document.createElement('td');
    let el_div_monthly_payment = document.createElement('div');
    el_div_monthly_payment.className='input-group input-group-sm';
    el_div_monthly_payment.innerHTML=`
        <div class='input-group-prepend'>
            <span class='input-group-text'>RM</span>
        </div>
        <input id='monthly_payment_amount_${rowNum}' type='text' class='form-control' disabled>
        `;

    el_td_monthly_payment.appendChild(el_div_monthly_payment);

    //Show
    let el_td_show = document.createElement('td');
    el_td_show.className='asb-align-center';
    el_td_show.innerHTML=`<input id="show_${rowNum}" type="checkbox">`

    //Details
    let el_td_details = document.createElement('td');
    el_td_details.innerHTML=`<button id="button_detail_${rowNum}" type="button" class="btn btn-outline-secondary btn-sm">Details</button>`

    //Remove
    let el_td_remove = document.createElement('td');
    el_td_remove.innerHTML=`<button id="button_remove_${rowNum}" type="button" class="btn btn-outline-secondary btn-sm">Remove</button>`

    el_tr.appendChild(el_th_row);
    el_tr.appendChild(el_td_show);
    el_tr.appendChild(el_td_loan_amount);
    el_tr.appendChild(el_td_insurance_amount);
    el_tr.appendChild(el_td_profit_rate);
    el_tr.appendChild(el_td_tenure);
    el_tr.appendChild(el_td_start_year);
    el_tr.appendChild(el_td_start_month);
    el_tr.appendChild(el_td_investment_period);
    el_tr.appendChild(el_td_monthly_payment);
    el_tr.appendChild(el_td_details);
    el_tr.appendChild(el_td_remove);

    document.getElementById('table_body').appendChild(el_tr);
}

function addDividendModal(row, year, rate){

    let el_tr = document.createElement('tr');
    
    let el_td_year = document.createElement('td');
    let el_div_year = document.createElement('div');
    el_div_year.innerHTML = `<label id="year_${row}">${year}</label>`;

    let el_td_dividend = document.createElement('td');
    let el_div_dividend = document.createElement('div');
    el_div_dividend.className = `input-group input-group-sm`;

    if(year === (new Date().getFullYear())){
        el_tr.style=`border-bottom-style: solid; border-bottom-color: indianred;`;
    }

    if(year<(new Date()).getFullYear()){
        el_div_dividend.innerHTML = `<input id="dividend_${row}" type="text" class="form-control" value="${rate}" disabled>`;
    }else{
        el_div_dividend.innerHTML = `<input id="dividend_${row}" type="text" class="form-control" value="${rate}">`;
    }

    el_td_year.appendChild(el_div_year);
    el_td_dividend.appendChild(el_div_dividend);

    el_tr.appendChild(el_td_year);
    el_tr.appendChild(el_td_dividend);

    document.getElementById('table_dividend_body').appendChild(el_tr);
}

function deleteRow(btn) {
    var row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function lookForChangesInTable(){
    let i = 0;

    document.getElementById('button_show_default').addEventListener('click', function(){        
        defaultValue();
        document.getElementById('show_1').checked = true;
    })

    //Using event delegation by targeting parent node after dynamically added table row
    document.getElementById('table_body').addEventListener('change', function(e){
        // console.log("ASNB: ", e.target.matches('#loan_amount_option_2'));
        // ToDo -> use event target match to instead of below code because... worse for performance
        if(e.target.type !== 'button'){
            let j = 0;
            let rows = document.querySelectorAll("#table_body>tr");
            rows.forEach(function(row){
                row.addEventListener('click', function(element){
                    //To prevent event looping
                    if(j===0){
                        // if(element.target.type==="text" || element.target.type==="select-one"){
                            console.log(`row: ${row.rowIndex}, value: ${element.target.value}`, element);
            
                            let loan_amount = document.getElementById(`loan_amount_option_${row.rowIndex}`).value;
                            let insurance_amount = document.getElementById(`insurance_amount_${row.rowIndex}`).value;
                            let profit_rate = document.getElementById(`profit_rate_${row.rowIndex}`).value;
                            profit_rate = profit_rate/100;
                            let tenure = document.getElementById(`tenure_option_${row.rowIndex}`).value;
                            let start_year = document.getElementById(`start_year_option_${row.rowIndex}`).value;
                            let start_month = document.getElementById(`start_month_option_${row.rowIndex}`).value;
                            let investment_period = document.getElementById(`investment_period_option_${row.rowIndex}`).value;
                            let type = 'year';
                        
                            let start_date = `${start_year}-${start_month}`;
                        
                            let result = amortizationCompound(
                                parseFloat(loan_amount), 
                                parseFloat(insurance_amount), 
                                parseFloat(profit_rate), 
                                parseInt(tenure), 
                                new Date(start_date), 
                                parseInt(investment_period), 
                                type);
                        
                            //Show the monthly payment value based on the result
                            document.getElementById(`monthly_payment_amount_${row.rowIndex}`).value = monthlyPaymentUpdate(result);
            
                            if(document.getElementById(`show_${row.rowIndex}`).checked){            
                                let getLabel = changeLabel(type, 'en-us', 'short', result);
                                
                                //Replace x-axis labels to current one
                                config.data.labels = getLabel.config_data_labels;
                                config.options.scales.xAxes[0].scaleLabel.labelString = getLabel.options_scales_xAxes_scaleLabel_labelString;
                            
                                //Replace the datasets
                                config.data.datasets.forEach( dataset => {
                                    changeDataset(dataset, result);
                                })
                            
                                window.myLine.update();
                            }
                            j++;
                        // }
                    }
                })
            });
        }
    })

    //Using event delegation by targeting parent node after dynamically added table row
    document.getElementById('table_body').addEventListener('click', function(e){
        // console.log("ASNB: ", e.target.matches('#loan_amount_option_2'));
        // ToDo -> use event target match to instead of below code because... worse for performance
        if(e.target.type === 'button'){
            let targetRow = 0;
            // let rows = document.querySelectorAll("#table_body>tr");
            let rows = document.querySelectorAll("#table_body>tr>th");
            console.log("ASNB: rows", rows);
            let fixRowNum = rows.length - 1;
            let lastRowNum = parseInt(rows[fixRowNum].innerText);
            console.log("ASNB: lastRowNum", lastRowNum);

            if(fixRowNum !== lastRowNum){
                for(let i = 0; i<lastRowNum; i++){
                    if(e.target.matches(`#button_remove_${i+1}`)){
                        console.log(e);
                        console.log('row: ', i+1);
                        document.getElementById('table').deleteRow(i+1);
                    }
                }
            }else{
                rows.forEach(function(row){
                    targetRow++;
                    if(e.target.matches(`#button_remove_${targetRow}`)){
                        // console.log(e);
                        console.log('row: ', row.innerText);
                        console.log("targetRow: ", targetRow);
                        document.getElementById('table').deleteRow(targetRow);
                    }
                });
            }
        }
    })
}
